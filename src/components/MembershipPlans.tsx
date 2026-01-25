import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Check, Sparkles } from "lucide-react";

const membershipTiers = [
  {
    name: "GREEN",
    tier: "Basic Tier",
    image: "https://i.imgur.com/rB3DdLk.png",
    glowColor: "rgba(34, 197, 94, 0.4)",
    gradientBg: "linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(34, 197, 94, 0.15) 100%)",
    benefits: [
      "10% discount on all spa and wellness services",
      "5% discount on Aesthetic Services",
      "5% discount on food and beverages (healthy café and juices)",
      "FREE 1 Hr. Massage or Relaxing Facial - during birth month only",
      "FREE Warts Removal (1 area only)",
      "FREE 1 Celebrity Drip (Wellness Drip)",
      "Complimentary Snacks at the Lounge Area",
      "Complimentary Wellness Kit",
      "Unlimited access (Member Only)",
    ],
  },
  {
    name: "GOLD",
    tier: "Premium Tier",
    image: "https://i.imgur.com/nkrUlEC.png",
    glowColor: "rgba(234, 179, 8, 0.5)",
    gradientBg: "linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(234, 179, 8, 0.15) 100%)",
    featured: true,
    benefits: [
      "FREE (2) Vanity Fit Drip (Anti-aging and Slimming)",
      "15% discount on spa and aesthetic services",
      "10% discount on food and beverages (Healthy Café and Juices)",
      "FREE (5) 1 Hr. Body Massage and (5) Relaxing Facial",
      "FREE (2pax) Warts Removal (1 area only)",
      "Complimentary Snacks at the Lounge Area",
      "Complimentary Wellness Kit",
      "Exclusive invites to HilomÈ Retreats and seasonal events",
      "Unlimited access (up to 2pax)",
      "Complimentary 1 night stay for 2pax with FREE Breakfast",
    ],
  },
  {
    name: "PLATINUM",
    tier: "Elite Tier",
    image: "https://i.imgur.com/MFJWBLn.png",
    glowColor: "rgba(148, 163, 184, 0.5)",
    gradientBg: "linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(148, 163, 184, 0.2) 100%)",
    benefits: [
      "20% discount on spa, aesthetic, food and beverages",
      "FREE 1 Skin or Medical Consultation",
      "FREE (12) Signature Services (Choice of Massage, Relaxing Facial)",
      "FREE (6) Multivitamin Drip",
      "FREE (3) Warts Removal (1 area only)",
      "Complimentary Snacks at the Lounge Area",
      "Complimentary Wellness Kit",
      "Exclusive invites to HilomÈ Retreats and seasonal events",
      "Unlimited access (up to 3pax)",
      "Complimentary 2 nights stay for 2pax with FREE Breakfast",
    ],
  },
];

const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 60,
    rotateX: -15,
    scaleY: 0.6,
    originY: 0,
  },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    scaleY: 1,
    transition: {
      duration: 0.8,
      delay: 0.2 + index * 0.2,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
      scaleY: {
        duration: 0.6,
        delay: 0.3 + index * 0.2,
        ease: "easeOut",
      },
    },
  }),
};

const floatAnimation = {
  y: [-8, 8, -8],
  transition: {
    duration: 4,
    repeat: Infinity,
    ease: "easeInOut" as const,
  },
};

const shimmerAnimation = {
  x: ["−100%", "100%"],
  opacity: [0, 1, 1, 0],
  transition: {
    duration: 2,
    repeat: Infinity,
    repeatDelay: 3,
    ease: "easeInOut" as const,
  },
};

const MembershipPlans = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });

  return (
    <section className="py-8 md:py-10 lg:py-12 bg-background relative overflow-hidden" ref={ref}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-cream/50 to-transparent" />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
      />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-6 md:mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-1.5 bg-accent/10 border border-accent/20 rounded-full px-3 py-1 mb-3"
          >
            <Sparkles className="w-3 h-3 text-accent" />
            <span className="text-accent font-medium text-[10px] md:text-xs uppercase tracking-wider">
              Exclusive Benefits Await
            </span>
            <Sparkles className="w-3 h-3 text-accent" />
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-lg md:text-xl lg:text-2xl font-semibold text-foreground mb-2"
          >
            Hilomè Membership Plans
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-muted-foreground text-xs md:text-sm px-2"
          >
            Unlock a world of wellness privileges. Choose the membership tier that suits your lifestyle and enjoy exclusive discounts, complimentary services, and VIP experiences.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 max-w-5xl mx-auto perspective-1000">
          {membershipTiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              custom={index}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={cardVariants}
              whileHover={{ 
                y: -12, 
                scale: 1.02,
                transition: { duration: 0.3 }
              }}
              className={`relative rounded-xl overflow-hidden group cursor-pointer ${
                tier.featured ? "lg:scale-105 lg:-translate-y-2" : ""
              }`}
              style={{
                boxShadow: `0 10px 25px -10px ${tier.glowColor}`,
                background: tier.gradientBg,
              }}
            >
              {/* Animated Border Glow */}
              <motion.div
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `linear-gradient(135deg, ${tier.glowColor}, transparent, ${tier.glowColor})`,
                  padding: "2px",
                }}
              />
              
              {/* Shimmer Effect */}
              <motion.div
                animate={shimmerAnimation}
                className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 pointer-events-none z-20"
              />

              {tier.featured && (
                <motion.div 
                  initial={{ x: 100, opacity: 0 }}
                  animate={isInView ? { x: 0, opacity: 1 } : {}}
                  transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                  className="absolute top-0 right-0 bg-accent text-accent-foreground text-[10px] font-semibold px-2 py-1 rounded-bl-lg z-10 shadow-lg"
                >
                  <motion.span
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    Most Popular
                  </motion.span>
                </motion.div>
              )}
              
              {/* Card Image with Float Animation */}
              <div className="p-3 pb-0 relative">
                <motion.div
                  animate={isInView ? floatAnimation : {}}
                  whileHover={{ 
                    rotateY: 10, 
                    rotateX: -5,
                    scale: 1.05,
                    transition: { duration: 0.4 }
                  }}
                  className="relative transform-gpu"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Card Glow Behind */}
                  <motion.div
                    className="absolute inset-0 rounded-lg blur-lg opacity-50"
                    style={{ backgroundColor: tier.glowColor }}
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.4, 0.6, 0.4],
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <img
                    src={tier.image}
                    alt={`Hilomè ${tier.name} Membership Card`}
                    className="w-full h-auto rounded-lg shadow-xl relative z-10 transform-gpu"
                  />
                </motion.div>
              </div>

              {/* Tier Info */}
              <div className="p-3 md:p-4 relative">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.5 + index * 0.2 }}
                  className="text-center mb-2"
                >
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                    {tier.tier}
                  </span>
                </motion.div>

                {/* Benefits List with Staggered Animation */}
                <ul className="space-y-1.5">
                  {tier.benefits.map((benefit, benefitIndex) => (
                    <motion.li 
                      key={benefitIndex} 
                      initial={{ opacity: 0, x: -30, y: 10 }}
                      animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
                      transition={{ 
                        delay: 0.8 + index * 0.2 + benefitIndex * 0.12,
                        duration: 0.5,
                        ease: [0.25, 0.46, 0.45, 0.94]
                      }}
                      className="flex items-start gap-1.5 group/item"
                    >
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={isInView ? { scale: 1, rotate: 0 } : {}}
                        transition={{ 
                          delay: 0.9 + index * 0.2 + benefitIndex * 0.12,
                          duration: 0.4,
                          type: "spring",
                          stiffness: 200
                        }}
                        whileHover={{ scale: 1.2, rotate: 360 }}
                      >
                        <Check className="w-3 h-3 text-accent flex-shrink-0 mt-0.5" />
                      </motion.div>
                      <span className="text-[10px] md:text-xs text-muted-foreground leading-relaxed group-hover/item:text-foreground transition-colors duration-200">
                        {benefit}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA with Pulse Animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1 }}
          className="text-center mt-6 md:mt-8"
        >
          <p className="text-muted-foreground text-xs md:text-sm mb-3">
            Ready to elevate your wellness journey?
          </p>
          <div className="flex items-center justify-center gap-3">
            <motion.a
              href="https://www.facebook.com/messages/t/791508777375110"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative inline-flex items-center justify-center gradient-accent text-accent-foreground rounded-full px-6 py-2 text-xs font-medium overflow-hidden group"
            >
              {/* Button Shimmer */}
              <motion.span
                className="absolute inset-0 w-1/4 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                animate={{ x: ["-100%", "400%"] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              />
              <span className="relative z-10">Inquire About Membership</span>
            </motion.a>
            <motion.a
              href="/membership"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center justify-center bg-primary text-primary-foreground rounded-full px-6 py-2 text-xs font-medium"
            >
              Join Now
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MembershipPlans;
