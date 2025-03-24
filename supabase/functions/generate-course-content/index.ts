
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { transcript, contentType } = await req.json();

    if (!transcript || !Array.isArray(transcript) || transcript.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Valid transcript data is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Combine transcript segments into a complete text
    const fullTranscript = transcript.map(segment => segment.text).join(' ');
    
    // Truncate if too long (to stay within token limits)
    const truncatedTranscript = fullTranscript.length > 15000 
      ? fullTranscript.substring(0, 15000) + '...'
      : fullTranscript;

    // Construct the prompt based on content type (summary or questions)
    let prompt = '';
    let systemPrompt = '';
    
    if (contentType === 'summary') {
      systemPrompt = 'You are an educational content assistant that helps create concise and informative course summaries from video transcripts.';
      prompt = `Please provide a well-structured summary of the following video transcript, highlighting the key points and main takeaways. Format it in an easy-to-read way with paragraphs and bullet points where appropriate:\n\n${truncatedTranscript}`;
    } else if (contentType === 'questions') {
      systemPrompt = 'You are an educational content assistant that helps create effective multiple-choice questions to test understanding of educational content.';
      prompt = `Based on the following video transcript, create 3 multiple choice questions with 4 options each to test understanding of the key concepts. For each question:
1. Make sure it tests understanding, not just recall
2. Label options as A, B, C, and D
3. Make all options plausible but only one correct
4. Clearly indicate the correct answer at the end of each question
5. Format consistently to make the questions easy to parse

Transcript:
${truncatedTranscript}`;
    } else {
      throw new Error('Invalid content type. Must be "summary" or "questions"');
    }

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Using a fast, affordable model
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API error:", errorData);
      throw new Error(`OpenAI API error: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;

    let result;
    if (contentType === 'summary') {
      result = { summary: generatedContent };
    } else {
      // Parse out the questions and process them into a structured format
      const questionsText = generatedContent;
      
      // This is a more robust parsing approach for question formats
      const questionRegex = /(\d+\.\s*.*?)\s*(?=A\.\s|A\)\s)/gs;
      const optionRegex = /([A-D])[.)]?\s*(.*?)(?=\s*(?:[A-D][.)]|Correct|Answer|$))/gs;
      const answerRegex = /(?:Correct\s*(?:answer|option)[: ]*([A-D])|Answer[: ]*([A-D]))/i;
      
      const questions = [];
      let questionMatches = questionsText.matchAll(questionRegex);
      
      for (const questionMatch of questionMatches) {
        const questionText = questionMatch[1].replace(/^\d+\.\s*/, '').trim();
        const questionEndIndex = questionMatch.index + questionMatch[0].length;
        
        // Get the text for this question including its options
        let questionEndNextIndex = questionsText.indexOf('2.', questionEndIndex);
        if (questionEndNextIndex === -1) {
          questionEndNextIndex = questionsText.indexOf('3.', questionEndIndex);
        }
        if (questionEndNextIndex === -1) {
          questionEndNextIndex = questionsText.length;
        }
        
        const questionOptionsPart = questionsText.substring(questionEndIndex, questionEndNextIndex);
        
        // Extract options
        const options = [];
        const optionMatches = questionOptionsPart.matchAll(optionRegex);
        
        for (const optionMatch of optionMatches) {
          options.push({
            id: optionMatch[1],
            text: optionMatch[2].trim()
          });
        }
        
        // Extract correct answer
        let correctAnswer = '';
        const answerMatch = questionOptionsPart.match(answerRegex);
        if (answerMatch) {
          correctAnswer = answerMatch[1] || answerMatch[2];
        } else {
          // Try to find answer in different format
          const altAnswerMatch = questionOptionsPart.match(/([A-D])\s*(?:is correct|is the correct answer)/i);
          if (altAnswerMatch) {
            correctAnswer = altAnswerMatch[1];
          }
        }
        
        if (options.length > 0 && correctAnswer) {
          questions.push({
            question: questionText,
            options,
            correctAnswer
          });
        }
      }
      
      // If the regex-based parsing failed, try a different approach
      if (questions.length === 0) {
        const questionBlocks = questionsText.split(/\n\n(?=\d+\.\s)/);
        
        questionBlocks.forEach(block => {
          const lines = block.split('\n');
          const questionLine = lines.find(line => /^\d+\.\s/.test(line));
          
          if (!questionLine) return;
          
          const questionText = questionLine.replace(/^\d+\.\s/, '').trim();
          
          const options = [];
          for (const line of lines) {
            const optionMatch = line.match(/^([A-D])[.)]?\s*(.*?)$/);
            if (optionMatch) {
              options.push({
                id: optionMatch[1],
                text: optionMatch[2].trim()
              });
            }
          }
          
          // Find correct answer
          let correctAnswer = '';
          const answerLine = lines.find(line => 
            line.includes('Correct answer:') || 
            line.includes('Answer:') ||
            line.match(/^Correct:/)
          );
          
          if (answerLine) {
            const answerMatch = answerLine.match(/([A-D])/);
            if (answerMatch) {
              correctAnswer = answerMatch[1];
            }
          }
          
          if (options.length > 0 && correctAnswer) {
            questions.push({
              question: questionText,
              options,
              correctAnswer
            });
          }
        });
      }
      
      result = { questions };
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in generate-course-content function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
