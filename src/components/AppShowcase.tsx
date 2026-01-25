import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Smartphone, Calendar, ShoppingBag, MessageCircle } from "lucide-react";

const features = [
  { icon: Calendar, title: "Easy Booking", desc: "Book appointments instantly" },
  { icon: ShoppingBag, title: "Shop Products", desc: "Browse skincare essentials" },
  { icon: MessageCircle, title: "Consultations", desc: "Chat with experts" },
];

const AppShowcase = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-100px" });

  return (
    <section className="py-10 md:py-14 bg-background relative overflow-hidden" ref={ref}>
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-cream/50 to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-8 md:mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="font-display text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold text-foreground mb-2 md:mb-3"
          >
            Enhance Your Experience
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-muted-foreground text-xs md:text-sm lg:text-base px-2"
          >
            Manage your skincare journey with the SkinStation App. Available for iOS and Android.
          </motion.p>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-6 md:gap-10">
          {/* Phone Mockups */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative flex items-center justify-center"
          >
            {/* Main Phone */}
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10"
            >
              <div className="w-36 h-[280px] md:w-44 md:h-[350px] bg-foreground rounded-[2rem] md:rounded-[2.5rem] p-1.5 shadow-elevated">
                <div className="w-full h-full bg-cream rounded-[1.75rem] md:rounded-[2rem] flex items-center justify-center overflow-hidden">
                  <div className="text-center p-3 md:p-4">
                    <div className="w-10 h-10 md:w-14 md:h-14 gradient-accent rounded-full mx-auto mb-2 md:mb-3 flex items-center justify-center">
                      <Smartphone className="w-5 h-5 md:w-7 md:h-7 text-accent-foreground" />
                    </div>
                    <h3 className="font-display text-sm md:text-base font-semibold text-foreground mb-1">
                      SkinStation
                    </h3>
                    <p className="text-[10px] md:text-xs text-muted-foreground">
                      Your skincare companion
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Secondary Phones */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute -left-12 top-6 z-0 hidden md:block"
            >
              <div className="w-36 h-[280px] bg-foreground/80 rounded-[2rem] p-1.5 shadow-card opacity-60">
                <div className="w-full h-full bg-brown-light/20 rounded-[1.75rem]" />
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -right-12 top-6 z-0 hidden md:block"
            >
              <div className="w-36 h-[280px] bg-foreground/80 rounded-[2rem] p-1.5 shadow-card opacity-60">
                <div className="w-full h-full bg-brown-light/20 rounded-[1.75rem]" />
              </div>
            </motion.div>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="space-y-4"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: 20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 md:w-11 md:h-11 gradient-accent rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-5 h-5 text-accent-foreground" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground text-sm">{feature.title}</h4>
                  <p className="text-xs text-muted-foreground">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
            
            <Button
              size="default"
              className="gradient-accent text-accent-foreground hover:opacity-90 rounded-full px-6 mt-3 text-sm"
            >
              Download the App
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AppShowcase;
