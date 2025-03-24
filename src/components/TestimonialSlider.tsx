
import React, { useEffect, useState } from "react";
import { Testimonial } from "@/types/testimonials";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Star, User } from "lucide-react";

const TestimonialSlider = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('testimonials')
          .select('*')
          .eq('is_published', true)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching testimonials:', error);
          return;
        }

        setTestimonials(data || []);
      } catch (error) {
        console.error('Error in testimonials fetch:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'testimonials'
        },
        () => {
          fetchTestimonials();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getProfileImageUrl = (path: string | null | undefined) => {
    if (!path) return null;
    
    return supabase.storage
      .from('testimonials')
      .getPublicUrl(path).data.publicUrl;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-flytbase-secondary"></div>
      </div>
    );
  }

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <Carousel className="w-full max-w-5xl mx-auto">
      <CarouselContent>
        {testimonials.map((testimonial) => (
          <CarouselItem key={testimonial.id} className="sm:basis-1/1 md:basis-1/2 lg:basis-1/3 p-1">
            <Card className="border-none bg-[#1A1F2C] shadow-card hover-lift h-full">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="mb-4 text-flytbase-secondary flex">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
                <p className="text-lg italic mb-6 text-neutral-300 flex-grow">"{testimonial.quote}"</p>
                <div className="flex items-center mt-auto">
                  {testimonial.profile_image ? (
                    <div className="h-12 w-12 rounded-full overflow-hidden bg-flytbase-secondary/20">
                      <img 
                        src={getProfileImageUrl(testimonial.profile_image)} 
                        alt={testimonial.name}
                        className="h-full w-full object-cover" 
                      />
                    </div>
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-flytbase-secondary/20 flex items-center justify-center text-flytbase-secondary font-bold text-xl">
                      {testimonial.name.charAt(0)}
                    </div>
                  )}
                  <div className="ml-4">
                    <p className="font-semibold text-white">{testimonial.name}</p>
                    <p className="text-sm text-neutral-400">{testimonial.title}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="flex justify-end gap-2 mt-4">
        <CarouselPrevious className="static translate-y-0 bg-flytbase-secondary/10 border-flytbase-secondary/20 text-flytbase-secondary hover:bg-flytbase-secondary/20" />
        <CarouselNext className="static translate-y-0 bg-flytbase-secondary/10 border-flytbase-secondary/20 text-flytbase-secondary hover:bg-flytbase-secondary/20" />
      </div>
    </Carousel>
  );
};

export default TestimonialSlider;
