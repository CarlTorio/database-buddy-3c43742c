import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Check, Sparkles, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { z } from "zod";
import { toast } from "sonner";

const membershipOptions = [
  {
    id: "green",
    name: "GREEN",
    tier: "Basic Tier",
    price: "₱8,888/year",
    image: "https://i.imgur.com/rB3DdLk.png",
    glowColor: "rgba(34, 197, 94, 0.4)",
    benefits: [
      "10% discount on all spa and wellness services",
      "5% discount on Aesthetic Services",
      "5% discount on food and beverages",
      "FREE 1 Hr. Massage or Relaxing Facial - during birth month only",
      "FREE Warts Removal (1 area only)",
      "FREE 1 Celebrity Drip (Wellness Drip)",
      "Complimentary Wellness Kit",
      "Unlimited access (Member Only)",
    ],
  },
  {
    id: "gold",
    name: "GOLD",
    tier: "Premium Tier",
    price: "₱18,888/year",
    image: "https://i.imgur.com/nkrUlEC.png",
    glowColor: "rgba(234, 179, 8, 0.5)",
    benefits: [
      "FREE (2) Vanity Fit Drip (Anti-aging and Slimming)",
      "15% discount on spa and aesthetic services",
      "10% discount on food and beverages",
      "FREE (5) 1 Hr. Body Massage and (5) Relaxing Facial",
      "FREE (2pax) Warts Removal (1 area only)",
      "Exclusive invites to HilomÈ Retreats and seasonal events",
      "Unlimited access (up to 2pax)",
      "Complimentary 1 night stay for 2pax with FREE Breakfast",
    ],
  },
  {
    id: "platinum",
    name: "PLATINUM",
    tier: "Elite Tier",
    price: "₱38,888/year",
    image: "https://i.imgur.com/MFJWBLn.png",
    glowColor: "rgba(148, 163, 184, 0.5)",
    benefits: [
      "20% discount on spa, aesthetic, food and beverages",
      "FREE 1 Skin or Medical Consultation",
      "FREE (12) Signature Services (Choice of Massage, Relaxing Facial)",
      "FREE (6) Multivitamin Drip",
      "FREE (3) Warts Removal (1 area only)",
      "Exclusive invites to HilomÈ Retreats and seasonal events",
      "Unlimited access (up to 3pax)",
      "Complimentary 2 nights stay for 2pax with FREE Breakfast",
    ],
  },
];

const formSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  contact: z.string().trim().min(1, "Contact number is required").max(20, "Contact number is too long"),
  email: z.string().trim().email("Please enter a valid email address").max(255, "Email is too long"),
  membership: z.string().min(1, "Please select a membership plan"),
  message: z.string().max(1000, "Message must be less than 1000 characters").optional(),
});

const Membership = () => {
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedMembership, setSelectedMembership] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const dataToValidate = {
      ...formData,
      membership: selectedMembership,
    };

    const result = formSchema.safeParse(dataToValidate);

    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.errors.forEach((error) => {
        if (error.path[0]) {
          newErrors[error.path[0] as string] = error.message;
        }
      });
      setErrors(newErrors);
      toast.error("Please fill in all required fields correctly");
      return;
    }

    // Form is valid - show success
    setIsSubmitted(true);
  };

  const selectedPlan = membershipOptions.find((m) => m.id === selectedMembership);

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cream/30 to-background">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl mx-auto text-center py-16"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <Check className="w-10 h-10 text-accent" />
              </motion.div>
              
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-4">
                Welcome to the Hilomè Family
              </h1>
              
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-8 max-w-lg mx-auto">
                Your wellness journey begins here. Our team will reach out shortly to welcome you and guide you through your membership benefits. Get ready to experience the art of holistic healing and rejuvenation.
              </p>
              
              <Link to="/">
                <Button className="gradient-accent text-accent-foreground rounded-full px-8 py-3">
                  Back to Home
                </Button>
              </Link>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream/30 to-background">
      <Header />
      <main className="pt-20 pb-10">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-4"
          >
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="text-muted-foreground hover:text-foreground gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-xl mx-auto mb-6"
          >
            <div className="inline-flex items-center gap-1.5 bg-accent/10 border border-accent/20 rounded-full px-2.5 py-0.5 mb-3">
              <Sparkles className="w-2.5 h-2.5 text-accent" />
              <span className="text-accent font-medium text-[10px] uppercase tracking-wider">
                Join Our Wellness Family
              </span>
              <Sparkles className="w-2.5 h-2.5 text-accent" />
            </div>
            
            <h1 className="font-display text-xl md:text-2xl lg:text-3xl font-semibold text-foreground mb-2">
              Membership Registration
            </h1>
            <p className="text-muted-foreground text-xs md:text-sm">
              Fill out the form below to start your journey with Hilomè. Choose your preferred membership tier and we'll get in touch with you shortly.
            </p>
          </motion.div>

          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Personal Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-card rounded-lg p-3 md:p-4 shadow-md border border-border/50"
              >
                <h2 className="font-display text-sm font-semibold text-foreground mb-3">
                  Personal Information
                </h2>
                
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="name" className="text-xs font-medium">
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`h-8 text-sm ${errors.name ? "border-red-500" : ""}`}
                    />
                    {errors.name && (
                      <p className="text-[10px] text-red-500">{errors.name}</p>
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="contact" className="text-xs font-medium">
                      Contact Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="contact"
                      name="contact"
                      placeholder="Enter your contact number"
                      value={formData.contact}
                      onChange={handleInputChange}
                      className={`h-8 text-sm ${errors.contact ? "border-red-500" : ""}`}
                    />
                    {errors.contact && (
                      <p className="text-[10px] text-red-500">{errors.contact}</p>
                    )}
                  </div>
                  
                  <div className="space-y-1 md:col-span-2">
                    <Label htmlFor="email" className="text-xs font-medium">
                      Email Address <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`h-8 text-sm ${errors.email ? "border-red-500" : ""}`}
                    />
                    {errors.email && (
                      <p className="text-[10px] text-red-500">{errors.email}</p>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Membership Selection */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-card rounded-xl p-4 md:p-6 shadow-md border border-border/50"
              >
                <h2 className="font-display text-base font-semibold text-foreground mb-1">
                  Choose Your Membership <span className="text-red-500">*</span>
                </h2>
                <p className="text-muted-foreground text-xs mb-4">
                  Select the membership tier that best suits your wellness needs.
                </p>
                
                {errors.membership && (
                  <p className="text-xs text-red-500 mb-4">{errors.membership}</p>
                )}

                <RadioGroup
                  value={selectedMembership}
                  onValueChange={(value) => {
                    setSelectedMembership(value);
                    if (errors.membership) {
                      setErrors((prev) => ({ ...prev, membership: "" }));
                    }
                  }}
                  className="grid md:grid-cols-3 gap-3"
                >
                  {membershipOptions.map((membership) => (
                    <motion.div
                      key={membership.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Label
                        htmlFor={membership.id}
                        className={`cursor-pointer block rounded-lg p-3 border-2 transition-all ${
                          selectedMembership === membership.id
                            ? "border-accent bg-accent/5"
                            : "border-border hover:border-accent/50"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <RadioGroupItem value={membership.id} id={membership.id} />
                          <div>
                            <p className="font-semibold text-sm text-foreground">{membership.name}</p>
                            <p className="text-[10px] text-muted-foreground">{membership.tier}</p>
                            <p className="text-xs font-medium text-accent">{membership.price}</p>
                          </div>
                        </div>
                        <img
                          src={membership.image}
                          alt={`${membership.name} Membership Card`}
                          className="w-full h-auto rounded-md"
                        />
                      </Label>
                    </motion.div>
                  ))}
                </RadioGroup>

                {/* Selected Plan Benefits */}
                {selectedPlan && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 p-3 bg-accent/5 rounded-lg border border-accent/20"
                  >
                    <h3 className="font-semibold text-sm text-foreground mb-2 flex items-center gap-2">
                      <Sparkles className="w-3 h-3 text-accent" />
                      {selectedPlan.name} Benefits Include:
                    </h3>
                    <ul className="grid md:grid-cols-2 gap-1.5">
                      {selectedPlan.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                          <Check className="w-3 h-3 text-accent flex-shrink-0 mt-0.5" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </motion.div>

              {/* Message */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-card rounded-lg p-3 md:p-4 shadow-md border border-border/50"
              >
                <h2 className="font-display text-sm font-semibold text-foreground mb-0.5">
                  Message or Note
                </h2>
                <p className="text-muted-foreground text-[10px] mb-2">
                  Any questions or special requests? Let us know!
                </p>
                
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Enter your message or note (optional)"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="min-h-[60px] text-sm"
                />
              </motion.div>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-center"
              >
                <Button
                  type="submit"
                  className="gradient-accent text-accent-foreground rounded-full px-10 py-2.5 text-sm font-medium"
                >
                  Submit Application
                </Button>
              </motion.div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Membership;
