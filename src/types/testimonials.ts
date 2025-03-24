
export interface Testimonial {
  id: string;
  name: string;
  title: string; 
  quote: string;
  rating: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface TestimonialFormData {
  name: string;
  title: string;
  quote: string;
  rating: number;
  is_published: boolean;
}
