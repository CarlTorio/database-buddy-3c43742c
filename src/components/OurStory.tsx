import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const OurStory = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-100px" });

  return (
    <section 
      ref={ref}
      className="relative min-h-[400px] md:min-h-[450px] lg:min-h-[500px]"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1920&h=1080&fit=crop')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="relative z-10 min-h-[400px] md:min-h-[450px] lg:min-h-[500px] flex items-center justify-center md:justify-start px-4 md:px-8 lg:px-20 py-12">
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="max-w-xl bg-background/70 p-6 md:p-8 rounded-2xl shadow-elevated"
        >
          <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-semibold text-foreground mb-4">
            Meet Ms. Esperanza
          </h2>
          <div className="space-y-3 text-muted-foreground text-sm md:text-base leading-relaxed">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            >
              Esperanza's journey into holistic healing began with a deep passion for helping others find natural paths to wellness and recovery.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
            >
              Today, she combines Traditional Chinese Medicine with Filipino Hilot traditions, guiding patients through their healing journey with compassion and expertise.
            </motion.p>
          </div>
          <div className="mt-8">
            <Link to="/our-story">
              <Button
                size="lg"
                className="gradient-accent text-primary-foreground hover:opacity-90 rounded-full px-8 text-base transition-all hover:scale-105 hover:shadow-lg"
              >
                Esperanza's Story
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default OurStory;
