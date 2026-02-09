import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Sparkles, Users, Gift, GraduationCap } from "lucide-react";

const benefits = [
  {
    icon: Sparkles,
    title: "Earn While Healing",
    description: "Help others achieve wellness while building your income",
  },
  {
    icon: Gift,
    title: "Product Discounts",
    description: "Exclusive member pricing on all HCIBiz products",
  },
  {
    icon: GraduationCap,
    title: "Training and Support",
    description: "Complete mentorship and business training",
  },
  {
    icon: Users,
    title: "Growing Network",
    description: "Join a nationwide community of wellness advocates",
  },
];

const MembershipSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    location: "",
    reason: "",
    howDidYouHear: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.phone || !formData.email) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('membership_inquiries').insert({
        full_name: formData.fullName,
        phone: formData.phone,
        email: formData.email.toLowerCase().trim(),
        location: formData.location || null,
        reason_for_joining: formData.reason || null,
        how_did_you_hear: formData.howDidYouHear || null,
        status: 'new',
      });

      if (error) throw error;

      toast.success("Thank you for your interest! We will contact you soon.");
      setFormData({
        fullName: "",
        phone: "",
        email: "",
        location: "",
        reason: "",
        howDidYouHear: "",
      });
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      toast.error("Failed to submit inquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="membership" className="py-10 md:py-14 bg-muted scroll-mt-24" ref={ref}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-6 md:mb-10 max-w-2xl mx-auto"
        >
          <h2 className="font-display text-xl md:text-2xl lg:text-3xl font-semibold text-foreground mb-2 md:mb-3">
            Join the HCIBiz Community
          </h2>
          <p className="text-muted-foreground text-xs md:text-sm lg:text-base leading-relaxed px-2">
            Start your wellness business journey with Health Code International
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="grid grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="bg-card p-4 rounded-xl shadow-soft hover:shadow-card transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-10 h-10 gradient-accent rounded-full flex items-center justify-center mb-3">
                    <benefit.icon className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <h3 className="font-display text-sm md:text-base font-semibold text-foreground mb-1">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">
                    {benefit.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Inquiry Form */}
          <motion.div
            id="membership-inquiry"
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-card p-6 rounded-xl shadow-soft scroll-mt-24"
          >
            <h3 className="font-display text-lg font-semibold text-foreground mb-4">
              Inquire About Membership
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  placeholder="Full Name *"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="h-11"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  placeholder="Phone Number *"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="h-11"
                />
                <Input
                  type="email"
                  placeholder="Email Address *"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="h-11"
                />
              </div>
              <div>
                <Input
                  placeholder="Location / City"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="h-11"
                />
              </div>
              <div>
                <Textarea
                  placeholder="Why do you want to join?"
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  rows={3}
                />
              </div>
              <div>
                <Select
                  value={formData.howDidYouHear}
                  onValueChange={(value) => setFormData({ ...formData, howDidYouHear: value })}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="How did you hear about us?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="referral">Referral</SelectItem>
                    <SelectItem value="walkin">Walk-in</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                type="submit"
                className="w-full gradient-accent text-primary-foreground rounded-full h-11"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Inquiry"}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MembershipSection;
