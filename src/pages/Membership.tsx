import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Check, Sparkles, ArrowLeft, CreditCard, Shield, Lock, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const membershipOptions = [{
  id: "green",
  name: "GREEN",
  tier: "Basic Tier",
  price: 8888,
  priceDisplay: "₱8,888/year",
  image: "https://i.imgur.com/rB3DdLk.png",
  glowColor: "rgba(34, 197, 94, 0.4)",
  benefits: ["10% discount on all spa and wellness services", "5% discount on Aesthetic Services", "5% discount on food and beverages", "FREE 1 Hr. Massage or Relaxing Facial - during birth month only", "FREE Warts Removal (1 area only)", "FREE 1 Celebrity Drip (Wellness Drip)", "Complimentary Wellness Kit", "Unlimited access (Member Only)"]
}, {
  id: "gold",
  name: "GOLD",
  tier: "Premium Tier",
  price: 18888,
  priceDisplay: "₱18,888/year",
  image: "https://i.imgur.com/nkrUlEC.png",
  glowColor: "rgba(234, 179, 8, 0.5)",
  benefits: ["FREE (2) Vanity Fit Drip (Anti-aging and Slimming)", "15% discount on spa and aesthetic services", "10% discount on food and beverages", "FREE (5) 1 Hr. Body Massage and (5) Relaxing Facial", "FREE (2pax) Warts Removal (1 area only)", "Exclusive invites to HilomÈ Retreats and seasonal events", "Unlimited access (up to 2pax)", "Complimentary 1 night stay for 2pax with FREE Breakfast"]
}, {
  id: "platinum",
  name: "PLATINUM",
  tier: "Elite Tier",
  price: 38888,
  priceDisplay: "₱38,888/year",
  image: "https://i.imgur.com/MFJWBLn.png",
  glowColor: "rgba(148, 163, 184, 0.5)",
  benefits: ["20% discount on spa, aesthetic, food and beverages", "FREE 1 Skin or Medical Consultation", "FREE (12) Signature Services (Choice of Massage, Relaxing Facial)", "FREE (6) Multivitamin Drip", "FREE (3) Warts Removal (1 area only)", "Exclusive invites to HilomÈ Retreats and seasonal events", "Unlimited access (up to 3pax)", "Complimentary 2 nights stay for 2pax with FREE Breakfast"]
}];

const formSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  contact: z.string().trim().min(1, "Contact number is required").max(20, "Contact number is too long"),
  email: z.string().trim().email("Please enter a valid email address").max(255, "Email is too long"),
  membership: z.string().min(1, "Please select a membership plan"),
  referralCode: z.string().max(6, "Referral code must be 6 characters").optional()
});

const Membership = () => {
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedMembership, setSelectedMembership] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    email: "",
    referralCode: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [membershipId] = useState(() => `HLM-${Date.now().toString(36).toUpperCase()}`);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handlePayNow = async (e: React.FormEvent) => {
    e.preventDefault();
    const dataToValidate = {
      ...formData,
      membership: selectedMembership,
      referralCode: formData.referralCode || undefined
    };
    const result = formSchema.safeParse(dataToValidate);
    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.errors.forEach(error => {
        if (error.path[0]) {
          newErrors[error.path[0] as string] = error.message;
        }
      });
      setErrors(newErrors);
      toast.error("Please fill in all required fields correctly");
      return;
    }

    // Referral code validation disabled until members table is created
    // if (formData.referralCode && formData.referralCode.length > 0) {
    //   const { data: existingMember, error } = await supabase
    //     .from('members')
    //     .select('id, referral_code')
    //     .eq('referral_code', formData.referralCode.toUpperCase())
    //     .eq('status', 'active')
    //     .maybeSingle();
    //   
    //   if (error || !existingMember) {
    //     setErrors(prev => ({ ...prev, referralCode: "Invalid referral code" }));
    //     toast.error("The referral code you entered is invalid");
    //     return;
    //   }
    // }

    setIsProcessing(true);
    
    // Simulate Stripe redirect delay (will be replaced with actual Stripe checkout)
    setTimeout(() => {
      toast.info("Stripe checkout will open here once configured");
      setIsSubmitted(true);
      setIsProcessing(false);
    }, 1500);
  };

  const selectedPlan = membershipOptions.find(m => m.id === selectedMembership);

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
              className="max-w-2xl mx-auto text-center py-12"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 bg-green-100/50 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <Check className="w-10 h-10 text-green-600 dark:text-green-400" />
              </motion.div>
              
              <h1 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-2">
                Payment Successful!
              </h1>
              <p className="text-muted-foreground mb-8">
                Welcome to the Hilomè {selectedPlan?.name} Family
              </p>

              {/* Order Confirmation Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="bg-card rounded-xl p-6 shadow-lg border border-border/50 text-left mb-8 max-w-md mx-auto"
              >
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border">
                  <img 
                    src={selectedPlan?.image} 
                    alt={selectedPlan?.name}
                    className="w-16 h-auto rounded-lg"
                  />
                  <div>
                    <p className="font-semibold text-foreground">{selectedPlan?.name} Membership</p>
                    <p className="text-sm text-muted-foreground">{selectedPlan?.tier}</p>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Membership ID</span>
                    <span className="font-mono font-semibold text-accent">{membershipId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name</span>
                    <span className="font-medium">{formData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email</span>
                    <span className="font-medium">{formData.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount Paid</span>
                    <span className="font-semibold text-green-600 dark:text-green-400">{selectedPlan?.priceDisplay}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <span className="inline-flex items-center gap-1 text-green-600 dark:text-green-400 font-medium">
                      <Check className="w-3 h-3" /> Active
                    </span>
                  </div>
                </div>
              </motion.div>

              <p className="text-sm text-muted-foreground mb-6">
                📧 A confirmation email has been sent to <strong>{formData.email}</strong>
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
        <div className="container mx-auto px-4 max-w-4xl">
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
                Secure Checkout
              </span>
              <Sparkles className="w-2.5 h-2.5 text-accent" />
            </div>
            
            <h1 className="font-display text-xl md:text-2xl lg:text-3xl font-semibold text-foreground mb-2">
              Membership Purchase
            </h1>
            <p className="text-muted-foreground text-xs md:text-sm">
              Select your membership tier and complete your purchase securely
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-5 gap-6">
            {/* Form Section */}
            <div className="lg:col-span-3">
              <form onSubmit={handlePayNow} className="space-y-5">
                {/* Personal Information */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="bg-card rounded-lg p-4 shadow-md border border-border/50"
                >
                  <h2 className="font-display text-sm font-semibold text-foreground mb-3">
                    Personal Information
                  </h2>
                  
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor="name" className="text-xs font-medium">
                        Full Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`h-9 text-sm ${errors.name ? "border-destructive" : ""}`}
                      />
                      {errors.name && <p className="text-[10px] text-destructive">{errors.name}</p>}
                    </div>
                    
                    <div className="space-y-1">
                      <Label htmlFor="contact" className="text-xs font-medium">
                        Contact Number <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="contact"
                        name="contact"
                        placeholder="Enter your contact number"
                        value={formData.contact}
                        onChange={handleInputChange}
                        className={`h-9 text-sm ${errors.contact ? "border-destructive" : ""}`}
                      />
                      {errors.contact && <p className="text-[10px] text-destructive">{errors.contact}</p>}
                    </div>
                    
                    <div className="space-y-1 md:col-span-2">
                      <Label htmlFor="email" className="text-xs font-medium">
                        Email Address <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your email address"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`h-9 text-sm ${errors.email ? "border-destructive" : ""}`}
                      />
                      {errors.email && <p className="text-[10px] text-destructive">{errors.email}</p>}
                      <p className="text-[10px] text-muted-foreground">Confirmation will be sent to this email</p>
                    </div>
                    
                    {/* Referral Code */}
                    <div className="space-y-1 md:col-span-2">
                      <Label htmlFor="referralCode" className="text-xs font-medium flex items-center gap-1.5">
                        <Gift className="w-3 h-3 text-accent" />
                        Referral Code <span className="text-muted-foreground">(optional)</span>
                      </Label>
                      <Input
                        id="referralCode"
                        name="referralCode"
                        placeholder="Enter a 6-character referral code"
                        value={formData.referralCode}
                        onChange={handleInputChange}
                        maxLength={6}
                        className={`h-9 text-sm uppercase ${errors.referralCode ? "border-destructive" : ""}`}
                      />
                      {errors.referralCode && <p className="text-[10px] text-destructive">{errors.referralCode}</p>}
                      <p className="text-[10px] text-muted-foreground">Get this code from an existing Hilomè member</p>
                    </div>
                  </div>
                </motion.div>

                {/* Membership Selection */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="bg-card rounded-xl p-4 md:p-5 shadow-md border border-border/50"
                >
                  <h2 className="font-display text-base font-semibold text-foreground mb-1">
                    Choose Your Membership <span className="text-destructive">*</span>
                  </h2>
                  <p className="text-muted-foreground text-xs mb-4">
                    Select the tier that best suits your wellness journey
                  </p>
                  
                  {errors.membership && <p className="text-xs text-destructive mb-4">{errors.membership}</p>}

                  <RadioGroup
                    value={selectedMembership}
                    onValueChange={value => {
                      setSelectedMembership(value);
                      if (errors.membership) {
                        setErrors(prev => ({ ...prev, membership: "" }));
                      }
                    }}
                    className="grid md:grid-cols-3 gap-3"
                  >
                    {membershipOptions.map(membership => (
                      <motion.div
                        key={membership.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Label
                          htmlFor={membership.id}
                          className={`cursor-pointer block rounded-lg p-3 border-2 transition-all ${
                            selectedMembership === membership.id
                              ? "border-accent bg-accent/5 shadow-md"
                              : "border-border hover:border-accent/50"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <RadioGroupItem value={membership.id} id={membership.id} />
                            <div>
                              <p className="font-semibold text-sm text-foreground">{membership.name}</p>
                              <p className="text-[10px] text-muted-foreground">{membership.tier}</p>
                              <p className="text-xs font-bold text-accent">{membership.priceDisplay}</p>
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

                {/* Mobile Order Summary */}
                <div className="lg:hidden">
                  <OrderSummary 
                    selectedPlan={selectedPlan} 
                    isProcessing={isProcessing}
                    onPayNow={() => {}}
                    isMobile
                  />
                </div>

                {/* Pay Now Button (Mobile) */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="lg:hidden"
                >
                  <Button
                    type="submit"
                    disabled={isProcessing || !selectedMembership}
                    className="w-full gradient-accent text-accent-foreground rounded-full py-3 text-sm font-semibold disabled:opacity-50 gap-2"
                  >
                    {isProcessing ? (
                      <>Processing...</>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4" />
                        Pay Now {selectedPlan && `- ${selectedPlan.priceDisplay}`}
                      </>
                    )}
                  </Button>
                  <div className="flex items-center justify-center gap-2 mt-3 text-xs text-muted-foreground">
                    <Lock className="w-3 h-3" />
                    <span>Secured by Stripe</span>
                  </div>
                </motion.div>
              </form>
            </div>

            {/* Desktop Order Summary Sidebar */}
            <div className="hidden lg:block lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="sticky top-24"
              >
                <OrderSummary 
                  selectedPlan={selectedPlan} 
                  isProcessing={isProcessing}
                  onPayNow={handlePayNow}
                />
              </motion.div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

// Order Summary Component
interface OrderSummaryProps {
  selectedPlan: typeof membershipOptions[0] | undefined;
  isProcessing: boolean;
  onPayNow: (e: React.FormEvent) => void;
  isMobile?: boolean;
}

const OrderSummary = ({ selectedPlan, isProcessing, onPayNow, isMobile }: OrderSummaryProps) => {
  return (
    <div className={`bg-card rounded-xl p-5 shadow-lg border border-border/50 ${isMobile ? '' : ''}`}>
      <h3 className="font-display text-base font-semibold text-foreground mb-4 flex items-center gap-2">
        <Shield className="w-4 h-4 text-accent" />
        Order Summary
      </h3>

      {selectedPlan ? (
        <>
          <div className="flex items-center gap-3 pb-4 border-b border-border mb-4">
            <img 
              src={selectedPlan.image} 
              alt={selectedPlan.name}
              className="w-14 h-auto rounded-lg shadow-sm"
            />
            <div>
              <p className="font-semibold text-sm text-foreground">{selectedPlan.name}</p>
              <p className="text-xs text-muted-foreground">{selectedPlan.tier}</p>
              <p className="text-xs text-muted-foreground">1 Year Membership</p>
            </div>
          </div>

          <div className="space-y-2 text-sm mb-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>₱{selectedPlan.price.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-green-600 dark:text-green-400">
              <span>Discount</span>
              <span>₱0</span>
            </div>
            <div className="flex justify-between font-semibold text-base pt-2 border-t border-border">
              <span>Total</span>
              <span className="text-accent">₱{selectedPlan.price.toLocaleString()}</span>
            </div>
          </div>

          {!isMobile && (
            <>
              <Button
                type="submit"
                form="membership-form"
                onClick={onPayNow}
                disabled={isProcessing}
                className="w-full gradient-accent text-accent-foreground rounded-full py-3 text-sm font-semibold disabled:opacity-50 gap-2 mb-3"
              >
                {isProcessing ? (
                  <>Processing...</>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    Pay Now
                  </>
                )}
              </Button>
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Lock className="w-3 h-3" />
                <span>Secured by Stripe</span>
              </div>
            </>
          )}
        </>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <CreditCard className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">Select a membership plan to see order details</p>
        </div>
      )}
    </div>
  );
};

export default Membership;