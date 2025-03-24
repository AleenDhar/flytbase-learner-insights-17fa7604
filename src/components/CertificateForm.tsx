
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';

interface CertificateFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CertificateFormValues) => void;
  assessmentTitle: string;
  score: number;
}

export interface CertificateFormValues {
  fullName: string;
  designation: string;
  email: string;
}

const CertificateForm = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  assessmentTitle,
  score 
}: CertificateFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CertificateFormValues>({
    defaultValues: {
      fullName: '',
      designation: '',
      email: '',
    }
  });

  const handleSubmit = async (data: CertificateFormValues) => {
    try {
      setIsSubmitting(true);
      onSubmit(data);
      toast({
        title: "Certificate Information Submitted",
        description: "Your certificate is being generated.",
      });
    } catch (error) {
      console.error('Error submitting certificate information:', error);
      toast({
        title: "Error",
        description: "Failed to process certificate information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-[#1A1F2C] text-white border-white/10 sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Generate Your Certificate</DialogTitle>
          <DialogDescription className="text-neutral-400">
            Congratulations on passing the assessment! Fill in your details to generate your certificate.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      className="bg-background text-foreground" 
                      placeholder="John Doe"
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="designation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Designation/Title</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      className="bg-background text-foreground" 
                      placeholder="Drone Pilot, Instructor, etc."
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      className="bg-background text-foreground" 
                      placeholder="your.email@example.com"
                      type="email"
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="bg-neutral-800/50 p-4 rounded-md border border-white/5">
              <p className="text-sm text-neutral-300 mb-2">Certificate Details:</p>
              <p className="text-sm text-white mb-1">Assessment: <span className="font-semibold">{assessmentTitle}</span></p>
              <p className="text-sm text-white">Score: <span className="font-semibold">{score}%</span></p>
            </div>
            
            <DialogFooter className="pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose} 
                className="border-white/10 text-white hover:bg-white/5"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-flytbase-secondary text-white hover:bg-flytbase-secondary/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Generate Certificate"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CertificateForm;
