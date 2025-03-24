
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
    if (contentType === 'summary') {
      prompt = `Please provide a concise summary of the following video transcript, highlighting the key points and main takeaways:\n\n${truncatedTranscript}`;
    } else if (contentType === 'questions') {
      prompt = `Based on the following video transcript, create 3 multiple choice questions with 4 options each to test understanding of the key concepts. Format each question with options labeled A, B, C, D, and include the correct answer at the end:\n\n${truncatedTranscript}`;
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
          { role: 'system', content: 'You are an educational content assistant that helps create concise course summaries and test questions from video transcripts.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
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
      
      // This is a simplified parsing approach - you might need to make it more robust
      // based on the actual format returned by the model
      const questionBlocks = questionsText.split(/\n\n(?=\d+\.\s)/);
      
      const questions = questionBlocks.map(block => {
        const lines = block.split('\n');
        const questionText = lines[0].replace(/^\d+\.\s/, '').trim();
        
        const options = lines.slice(1, 5).map(line => {
          const match = line.match(/^([A-D])\)\s(.+)$/) || line.match(/^([A-D])\.?\s(.+)$/);
          return match ? { id: match[1], text: match[2].trim() } : null;
        }).filter(Boolean);

        // Extract correct answer - it could be formatted in different ways
        const correctAnswerLine = lines.find(line => 
          line.includes('Correct answer:') || 
          line.includes('Answer:') || 
          line.match(/^Correct:/)
        ) || '';
        
        const correctAnswerMatch = correctAnswerLine.match(/([A-D])/);
        const correctAnswer = correctAnswerMatch ? correctAnswerMatch[1] : '';

        return {
          question: questionText,
          options,
          correctAnswer
        };
      }).filter(q => q.question && q.options.length > 0);

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
