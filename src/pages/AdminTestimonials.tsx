
import React, { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { Testimonial, TestimonialFormData } from "@/types/testimonials";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Pencil, Plus, Star, Trash2, CheckCircle, X } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-mobile";

const INITIAL_FORM_DATA: TestimonialFormData = {
  name: "",
  title: "",
  quote: "",
  rating: 5,
  is_published: false,
};

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState<TestimonialFormData>(INITIAL_FORM_DATA);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [testimonialToDelete, setTestimonialToDelete] = useState<Testimonial | null>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { toast } = useToast();

  useEffect(() => {
    fetchTestimonials();

    // Set up realtime subscription
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

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching testimonials:', error);
        toast({
          title: "Error",
          description: "Failed to fetch testimonials",
          variant: "destructive",
        });
        return;
      }

      setTestimonials(data || []);
    } catch (error) {
      console.error('Error in testimonials fetch:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, is_published: checked }));
  };

  const handleRatingChange = (newRating: number) => {
    setFormData((prev) => ({ ...prev, rating: newRating }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (currentTestimonial) {
        // Update existing testimonial
        const { error } = await supabase
          .from('testimonials')
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', currentTestimonial.id);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Testimonial updated successfully",
        });
      } else {
        // Create new testimonial
        const { error } = await supabase
          .from('testimonials')
          .insert([formData]);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Testimonial created successfully",
        });
      }

      // Reset form and close dialog
      resetForm();
    } catch (error) {
      console.error('Error saving testimonial:', error);
      toast({
        title: "Error",
        description: "Failed to save testimonial",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!testimonialToDelete) return;
    
    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', testimonialToDelete.id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Testimonial deleted successfully",
      });
      
      setDeleteDialogOpen(false);
      setTestimonialToDelete(null);
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      toast({
        title: "Error",
        description: "Failed to delete testimonial",
        variant: "destructive",
      });
    }
  };

  const openEditForm = (testimonial: Testimonial) => {
    setCurrentTestimonial(testimonial);
    setFormData({
      name: testimonial.name,
      title: testimonial.title,
      quote: testimonial.quote,
      rating: testimonial.rating,
      is_published: testimonial.is_published,
    });
    setOpenFormDialog(true);
  };

  const confirmDelete = (testimonial: Testimonial) => {
    setTestimonialToDelete(testimonial);
    setDeleteDialogOpen(true);
  };

  const resetForm = () => {
    setFormData(INITIAL_FORM_DATA);
    setCurrentTestimonial(null);
    setOpenFormDialog(false);
  };

  const FormComponent = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          Name
        </label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
          placeholder="John Doe"
          className="bg-background text-foreground"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium">
          Title
        </label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          required
          placeholder="Drone Pilot"
          className="bg-background text-foreground"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="quote" className="text-sm font-medium">
          Testimonial
        </label>
        <Textarea
          id="quote"
          name="quote"
          value={formData.quote}
          onChange={handleInputChange}
          required
          placeholder="The courses at FlytBase Academy were amazing..."
          className="bg-background text-foreground min-h-[100px]"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Rating</label>
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => handleRatingChange(star)}
              className="focus:outline-none"
            >
              <Star
                className={`h-6 w-6 ${
                  star <= formData.rating
                    ? "text-flytbase-secondary fill-flytbase-secondary"
                    : "text-gray-400"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="is_published"
          checked={formData.is_published}
          onCheckedChange={handleCheckboxChange}
        />
        <label
          htmlFor="is_published"
          className="text-sm font-medium leading-none cursor-pointer"
        >
          Publish testimonial
        </label>
      </div>

      <div className="pt-4">
        <Button type="submit" className="w-full bg-flytbase-secondary text-white hover:bg-flytbase-secondary/90">
          {currentTestimonial ? "Update Testimonial" : "Add Testimonial"}
        </Button>
      </div>
    </form>
  );

  return (
    <div className="min-h-screen bg-flytbase-primary">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-neutral-100">Testimonials Management</h1>
            <p className="text-neutral-400 mt-1">
              Create, edit and manage student testimonials
            </p>
          </div>

          {isMobile ? (
            <Drawer>
              <DrawerTrigger asChild>
                <Button className="bg-flytbase-secondary hover:bg-flytbase-secondary/90">
                  <Plus className="mr-2 h-4 w-4" /> Add Testimonial
                </Button>
              </DrawerTrigger>
              <DrawerContent className="bg-[#1A1F2C] text-white">
                <DrawerHeader>
                  <DrawerTitle>Add New Testimonial</DrawerTitle>
                  <DrawerDescription className="text-neutral-400">
                    Fill in the details to add a new student testimonial.
                  </DrawerDescription>
                </DrawerHeader>
                <div className="p-4">
                  <FormComponent />
                </div>
                <DrawerFooter>
                  <DrawerClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          ) : (
            <Button 
              className="bg-flytbase-secondary hover:bg-flytbase-secondary/90"
              onClick={() => {
                setCurrentTestimonial(null);
                setFormData(INITIAL_FORM_DATA);
                setOpenFormDialog(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" /> Add Testimonial
            </Button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-flytbase-secondary"></div>
          </div>
        ) : testimonials.length === 0 ? (
          <div className="bg-[#1A1F2C] border border-white/5 rounded-lg p-8 text-center">
            <h3 className="text-xl font-semibold text-white mb-2">No testimonials yet</h3>
            <p className="text-neutral-400 mb-6">
              Start adding testimonials from your students to showcase on the home page.
            </p>
            {isMobile ? (
              <Drawer>
                <DrawerTrigger asChild>
                  <Button className="bg-flytbase-secondary hover:bg-flytbase-secondary/90">
                    <Plus className="mr-2 h-4 w-4" /> Add First Testimonial
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="bg-[#1A1F2C] text-white">
                  <DrawerHeader>
                    <DrawerTitle>Add New Testimonial</DrawerTitle>
                    <DrawerDescription className="text-neutral-400">
                      Fill in the details to add a new student testimonial.
                    </DrawerDescription>
                  </DrawerHeader>
                  <div className="p-4">
                    <FormComponent />
                  </div>
                  <DrawerFooter>
                    <DrawerClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            ) : (
              <Button 
                className="bg-flytbase-secondary hover:bg-flytbase-secondary/90"
                onClick={() => {
                  setCurrentTestimonial(null);
                  setFormData(INITIAL_FORM_DATA);
                  setOpenFormDialog(true);
                }}
              >
                <Plus className="mr-2 h-4 w-4" /> Add First Testimonial
              </Button>
            )}
          </div>
        ) : (
          <div className="bg-[#1A1F2C] border border-white/5 rounded-lg overflow-hidden">
            <Table className="w-full">
              <TableHeader>
                <TableRow className="border-white/5 hover:bg-white/5">
                  <TableHead className="text-white">Name</TableHead>
                  <TableHead className="text-white">Title</TableHead>
                  <TableHead className="text-white">Rating</TableHead>
                  <TableHead className="text-white">Status</TableHead>
                  <TableHead className="text-white text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testimonials.map((testimonial) => (
                  <TableRow 
                    key={testimonial.id} 
                    className="border-white/5 hover:bg-white/5"
                  >
                    <TableCell className="font-medium text-white">{testimonial.name}</TableCell>
                    <TableCell className="text-neutral-300">{testimonial.title}</TableCell>
                    <TableCell>
                      <div className="flex">
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                          <Star 
                            key={i} 
                            className="h-4 w-4 text-flytbase-secondary fill-flytbase-secondary" 
                          />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      {testimonial.is_published ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle className="mr-1 h-3 w-3" /> Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          <X className="mr-1 h-3 w-3" /> Draft
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditForm(testimonial)}
                        className="text-white hover:text-flytbase-secondary hover:bg-flytbase-secondary/10"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => confirmDelete(testimonial)}
                        className="text-white hover:text-red-500 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </main>

      {/* Form Dialog for Desktop */}
      <Dialog open={openFormDialog && !isMobile} onOpenChange={setOpenFormDialog}>
        <DialogContent className="bg-[#1A1F2C] text-white border-white/10 sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {currentTestimonial ? "Edit Testimonial" : "Add New Testimonial"}
            </DialogTitle>
            <DialogDescription className="text-neutral-400">
              {currentTestimonial
                ? "Update the testimonial details below."
                : "Fill in the details to add a new student testimonial."}
            </DialogDescription>
          </DialogHeader>
          <FormComponent />
          <DialogFooter className="mt-6">
            <Button 
              variant="outline" 
              onClick={resetForm}
              className="border-white/10 text-white hover:bg-white/5"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-[#1A1F2C] text-white border-white/10 sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription className="text-neutral-400">
              Are you sure you want to delete this testimonial? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 space-x-2">
            <Button 
              variant="outline" 
              onClick={() => setDeleteDialogOpen(false)}
              className="border-white/10 text-white hover:bg-white/5"
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminTestimonials;
