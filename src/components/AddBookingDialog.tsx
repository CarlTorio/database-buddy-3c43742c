import React, { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { z } from 'zod';

const bookingSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  contact_number: z.string().trim().min(1, "Contact number is required").max(20, "Contact number too long"),
  preferred_date: z.string().min(1, "Preferred date is required"),
  preferred_time: z.string().min(1, "Preferred time is required"),
  membership: z.string().optional(),
  message: z.string().max(500, "Message must be less than 500 characters").optional(),
});

interface AddBookingDialogProps {
  onBookingAdded: () => void;
}

const AddBookingDialog = ({ onBookingAdded }: AddBookingDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact_number: '',
    preferred_date: '',
    preferred_time: '',
    membership: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const timeSlots = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
    '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM'
  ];

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      contact_number: '',
      preferred_date: '',
      preferred_time: '',
      membership: '',
      message: '',
    });
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = bookingSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('bookings')
        .insert({
          name: formData.name.trim(),
          email: formData.email.trim(),
          contact_number: formData.contact_number.trim(),
          preferred_date: formData.preferred_date,
          preferred_time: formData.preferred_time,
          membership: formData.membership || null,
          message: formData.message.trim() || null,
          status: 'pending', // Bookings start as pending
        });

      if (error) throw error;

      toast.success(`Booking for ${formData.name} added successfully!`);
      resetForm();
      setOpen(false);
      onBookingAdded();
    } catch (error) {
      console.error('Error adding booking:', error);
      toast.error('Failed to add booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) resetForm();
    }}>
      <DialogTrigger asChild>
        <Button className="gap-1 sm:gap-2 h-9 sm:h-10 text-[10px] sm:text-sm px-2 sm:px-4">
          <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Add </span>Book
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Add Walk-in Booking</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter client name"
              className={errors.name ? 'border-destructive' : ''}
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter email address"
              className={errors.email ? 'border-destructive' : ''}
            />
            {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact_number">Contact Number *</Label>
            <Input
              id="contact_number"
              value={formData.contact_number}
              onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })}
              placeholder="Enter phone number"
              className={errors.contact_number ? 'border-destructive' : ''}
            />
            {errors.contact_number && <p className="text-xs text-destructive">{errors.contact_number}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="preferred_date">Date *</Label>
              <Input
                id="preferred_date"
                type="date"
                value={formData.preferred_date}
                onChange={(e) => setFormData({ ...formData, preferred_date: e.target.value })}
                className={errors.preferred_date ? 'border-destructive' : ''}
              />
              {errors.preferred_date && <p className="text-xs text-destructive">{errors.preferred_date}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferred_time">Time *</Label>
              <Select value={formData.preferred_time} onValueChange={(value) => setFormData({ ...formData, preferred_time: value })}>
                <SelectTrigger className={errors.preferred_time ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>{time}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.preferred_time && <p className="text-xs text-destructive">{errors.preferred_time}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Notes</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Any additional notes..."
              rows={3}
              className={errors.message ? 'border-destructive' : ''}
            />
            {errors.message && <p className="text-xs text-destructive">{errors.message}</p>}
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Add Booking
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddBookingDialog;
