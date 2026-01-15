import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, Phone, Mail, MapPin, Clock, Facebook, Instagram, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DateTimePicker from "@/components/DateTimePicker";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const BookConsultation = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contactNumber: "",
    preferredBranch: "",
    date: "",
    time: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [isDateTimePickerOpen, setIsDateTimePickerOpen] = useState(false);
  const handleDateTimeConfirm = (date: string, time: string) => {
    setFormData(prev => ({
      ...prev,
      date,
      time
    }));
  };
  const memberships = ["Non-member", "Green Member", "Gold Member", "Platinum Member"];
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (formData.name && formData.email && formData.contactNumber && formData.preferredBranch && formData.date && formData.time) {
      setIsSubmitting(true);
      try {
        // Save booking to database
        const { error } = await supabase.from('bookings').insert({
          name: formData.name,
          email: formData.email,
          phone: formData.contactNumber,
          membership: formData.preferredBranch,
          date: formData.date,
          time: formData.time,
          message: formData.message || null,
          status: 'pending'
        });

        if (error) throw error;

        // Navigate to thank you page with booking details
        navigate("/thank-you", {
          state: {
            name: formData.name,
            email: formData.email,
            contactNumber: formData.contactNumber,
            membership: formData.preferredBranch,
            date: formData.date,
            time: formData.time,
            message: formData.message || undefined
          }
        });
        toast.success("Consultation booked successfully!");
      } catch (error) {
        console.error('Error booking consultation:', error);
        toast.error("Failed to book consultation. Please try again.");
        setIsSubmitting(false);
      }
    } else {
      toast.error("Please fill in all required fields");
    }
  };
  return <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <motion.button initial={{
          opacity: 0,
          x: -20
        }} animate={{
          opacity: 1,
          x: 0
        }} onClick={() => navigate("/")} className="flex items-center gap-2 text-foreground/70 hover:text-foreground transition-colors mb-6">
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </motion.button>

          {/* Two Column Layout */}
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.1
        }} className="grid grid-cols-1 lg:grid-cols-2 gap-0 max-w-6xl mx-auto overflow-hidden rounded-2xl shadow-elevated">
            {/* Left Column - Get in Touch */}
            <div className="bg-muted p-8 md:p-12 flex flex-col justify-center">
              <h2 className="font-display text-3xl md:text-4xl text-foreground mb-4">
                Get in Touch
              </h2>
              <p className="text-foreground/70 text-base mb-8">
                Send us your questions or messages by filling out the form. We'll get back to you as soon as possible.
              </p>

              {/* Contact Information */}
              <div className="mb-8">
                <h3 className="text-foreground font-semibold mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-foreground/80">
                    <div className="w-8 h-8 rounded-full border border-primary flex items-center justify-center">
                      <Phone className="w-4 h-4 text-primary" />
                    </div>
                    <span>0977 334 4200</span>
                  </div>
                  <div className="flex items-center gap-3 text-foreground/80">
                    <div className="w-8 h-8 rounded-full border border-primary flex items-center justify-center">
                      <Mail className="w-4 h-4 text-primary" />
                    </div>
                    <span>cruzskin@gmail.com</span>
                  </div>
                  <div className="flex items-center gap-3 text-foreground/80">
                    <div className="w-8 h-8 rounded-full border border-primary flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-primary" />
                    </div>
                    <span>6014 Mandaue City, Philippines</span>
                  </div>
                  <div className="flex items-start gap-3 text-foreground/80">
                    <div className="w-8 h-8 rounded-full border border-primary flex items-center justify-center flex-shrink-0">
                      <Clock className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex flex-col">
                      <span>Mon - Sat: 9:00 AM - 7:00 PM</span>
                      <span>Sunday: 10:00 AM - 5:00 PM</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Follow Us */}
              <div>
                <h3 className="text-foreground font-semibold mb-4">Follow Us</h3>
                <div className="flex items-center gap-3 mb-3">
                  <a href="https://www.facebook.com/profile.php?id=61580172268741" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-primary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                    <Facebook className="w-5 h-5 text-primary hover:text-primary-foreground" />
                  </a>
                  <a href="https://instagram.com/Hilome" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-primary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                    <Instagram className="w-5 h-5 text-primary hover:text-primary-foreground" />
                  </a>
                </div>
                <p className="text-foreground/60 text-sm">
                  @Hilomè on Facebook  •  @Hilomè on Instagram
                </p>
              </div>
            </div>

            {/* Right Column - Booking Form */}
            <div className="bg-primary p-8 md:p-12">
              {/* Form Header */}
              <div className="mb-6">
                <h2 className="font-display text-2xl md:text-3xl text-primary-foreground mb-2">
                  Book Your Consultation
                </h2>
                <p className="text-primary-foreground/70 text-sm">
                  Schedule a consultation with our skincare specialists.
                </p>
              </div>
              
              <div className="space-y-5">
                {/* Name Field */}
                <div>
                  <label className="block text-primary-foreground font-semibold text-sm mb-1">
                    Name <span className="text-red-300">*</span>
                  </label>
                  <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} className="w-full bg-transparent border-b-2 border-primary-foreground/50 text-primary-foreground placeholder-primary-foreground/50 py-2 px-0 focus:outline-none focus:border-accent transition-colors text-sm" />
                </div>

                {/* Email and Contact Number Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-primary-foreground font-semibold text-sm mb-1">
                      Email <span className="text-red-300">*</span>
                    </label>
                    <input type="email" name="email" placeholder="E-mail" value={formData.email} onChange={handleChange} className="w-full bg-transparent border-b-2 border-primary-foreground/50 text-primary-foreground placeholder-primary-foreground/50 py-2 px-0 focus:outline-none focus:border-accent transition-colors text-sm" />
                  </div>
                  <div>
                    <label className="block text-primary-foreground font-semibold text-sm mb-1">
                      Contact Number <span className="text-red-300">*</span>
                    </label>
                    <div className="flex items-center border-b-2 border-primary-foreground/50 focus-within:border-accent transition-colors">
                      <span className="mr-2 text-xl">🇵🇭</span>
                      <input type="tel" name="contactNumber" placeholder="Contact Number" value={formData.contactNumber} onChange={handleChange} className="flex-1 bg-transparent text-primary-foreground placeholder-primary-foreground/50 py-2 px-0 focus:outline-none text-sm" />
                    </div>
                  </div>
                </div>

                {/* Membership */}
                <div>
                  <label className="block text-primary-foreground font-semibold text-sm mb-1">
                    Membership <span className="text-red-300">*</span>
                  </label>
                  <select name="preferredBranch" value={formData.preferredBranch} onChange={handleChange} className="w-full bg-transparent border-b-2 border-primary-foreground/50 text-primary-foreground py-2 px-0 focus:outline-none focus:border-accent transition-colors cursor-pointer text-sm" style={{
                  color: formData.preferredBranch ? "hsl(var(--primary-foreground))" : "hsl(var(--primary-foreground) / 0.5)"
                }}>
                    {memberships.map((membership, index) => <option key={index} value={membership} className="bg-primary text-primary-foreground">
                        {membership}
                      </option>)}
                  </select>
                </div>

                {/* Preferred Schedule */}
                <div>
                  <label className="block text-primary-foreground font-semibold text-sm mb-1">
                    Preferred Schedule <span className="text-red-300">*</span>
                  </label>
                  <button type="button" onClick={() => setIsDateTimePickerOpen(true)} className="w-full bg-transparent border-b-2 border-primary-foreground/50 text-primary-foreground py-2 px-0 focus:outline-none focus:border-accent transition-colors text-sm cursor-pointer text-left flex items-center justify-between">
                    <span className={formData.date && formData.time ? "text-primary-foreground" : "text-primary-foreground/50"}>
                      {formData.date && formData.time ? `${format(new Date(formData.date), "MMMM d, yyyy")} at ${formData.time}` : "Select date and time"}
                    </span>
                    <Calendar className="w-4 h-4 text-primary-foreground/70" />
                  </button>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-primary-foreground font-semibold text-sm mb-1">
                    Message
                  </label>
                  <textarea name="message" placeholder="Type your message here..." value={formData.message} onChange={handleChange} rows={2} className="w-full bg-transparent border-b-2 border-primary-foreground/50 text-primary-foreground placeholder-primary-foreground/50 py-2 px-0 focus:outline-none focus:border-accent transition-colors resize-none text-sm" />
                </div>

                {/* Submit Button */}
                <motion.div whileHover={{
                scale: 1.02
              }} whileTap={{
                scale: 0.98
              }} className="pt-2">
                  <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full bg-accent text-accent-foreground font-bold py-4 rounded-full hover:bg-accent/90 transition-colors disabled:opacity-50" size="lg">
                    {submitted ? <span className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        Consultation Booked!
                      </span> : isSubmitting ? "Booking..." : "Book your consultation now!"}
                  </Button>
                </motion.div>
              </div>

              {submitted && <motion.div initial={{
              opacity: 0,
              y: 10
            }} animate={{
              opacity: 1,
              y: 0
            }} className="mt-4 text-center text-primary-foreground">
                  <p className="text-base">Thank you! We'll contact you soon.</p>
                </motion.div>}
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
      
      <DateTimePicker isOpen={isDateTimePickerOpen} onClose={() => setIsDateTimePickerOpen(false)} onConfirm={handleDateTimeConfirm} selectedDate={formData.date} selectedTime={formData.time} />
    </div>;
};
export default BookConsultation;