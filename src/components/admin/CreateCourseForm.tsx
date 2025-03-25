
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const CreateCourseForm = () => {
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!playlistUrl || !playlistUrl.includes('youtube.com/playlist')) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid YouTube playlist URL",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Trigger the webhook
      const response = await fetch('https://srv-roxra.app.n8n.cloud/webhook/35ce5709-5702-4e41-b199-81cf683a5b32', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          playlist_url: playlistUrl
        }),
      });
      
      if (response.ok) {
        toast({
          title: "Success",
          description: "Course creation has started successfully!",
        });
        setPlaylistUrl('');
      } else {
        throw new Error('Failed to trigger webhook');
      }
    } catch (error) {
      console.error('Error triggering webhook:', error);
      toast({
        title: "Error",
        description: "Failed to start course creation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card className="p-6 bg-[#1A1F2C] border-white/5">
      <h2 className="text-xl font-semibold text-white mb-4">Create New Course from YouTube Playlist</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="playlistUrl" className="text-white">YouTube Playlist URL</Label>
          <Input
            id="playlistUrl"
            value={playlistUrl}
            onChange={(e) => setPlaylistUrl(e.target.value)}
            placeholder="https://www.youtube.com/playlist?list=..."
            className="bg-[#12151D] border-white/10 text-white"
            disabled={isSubmitting}
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-flytbase-secondary hover:bg-flytbase-secondary/90"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            'Create Course'
          )}
        </Button>
      </form>
    </Card>
  );
};

export default CreateCourseForm;
