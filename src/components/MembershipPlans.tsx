import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Check } from "lucide-react";
import membershipGold from "@/assets/membership-gold.png";
import membershipGreen from "@/assets/membership-green.png";
import membershipPlatinum from "@/assets/membership-platinum.png";

const membershipTiers = [
  {
    name: "GREEN",
    tier: "Basic Tier",
    image: membershipGreen,
    color: "from-green-500 to-green-600",
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
    image: membershipGold,
    color: "from-yellow-500 to-amber-600",
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
    image: membershipPlatinum,
    color: "from-gray-400 to-gray-600",
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

const MembershipPlans = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-background relative overflow-hidden" ref={ref}>
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-cream/50 to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-block text-accent font-medium text-xs md:text-sm uppercase tracking-wider mb-2"
          >
            Exclusive Benefits Await
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="font-display text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold text-foreground mb-3 md:mb-4"
          >
            Hilomè Membership Plans
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-muted-foreground text-sm md:text-base lg:text-lg px-2"
          >
            Unlock a world of wellness privileges. Choose the membership tier that suits your lifestyle and enjoy exclusive discounts, complimentary services, and VIP experiences.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {membershipTiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.15 }}
              className={`relative bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-elevated transition-shadow duration-300 ${
                tier.featured ? "ring-2 ring-accent md:scale-105" : ""
              }`}
            >
              {tier.featured && (
                <div className="absolute top-0 right-0 bg-accent text-accent-foreground text-xs font-semibold px-3 py-1 rounded-bl-lg z-10">
                  Most Popular
                </div>
              )}
              
              {/* Card Image */}
              <div className="p-4 pb-0">
                <motion.div
                  whileHover={{ scale: 1.02, rotateY: 5 }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                >
                  <img
                    src={tier.image}
                    alt={`Hilomè ${tier.name} Membership Card`}
                    className="w-full h-auto rounded-xl shadow-lg"
                  />
                </motion.div>
              </div>

              {/* Tier Info */}
              <div className="p-5 md:p-6">
                <div className="text-center mb-4">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">
                    {tier.tier}
                  </span>
                </div>

                {/* Benefits List */}
                <ul className="space-y-2">
                  {tier.benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                        {benefit}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-10 md:mt-14"
        >
          <p className="text-muted-foreground text-sm md:text-base mb-4">
            Ready to elevate your wellness journey?
          </p>
          <a
            href="#contact"
            className="inline-flex items-center justify-center gradient-accent text-accent-foreground hover:opacity-90 rounded-full px-8 py-3 text-sm font-medium transition-all hover:scale-105"
          >
            Inquire About Membership
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default MembershipPlans;
