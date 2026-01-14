import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const OurStory = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section 
      ref={ref}
      className="relative min-h-[400px] md:min-h-[450px] lg:min-h-[500px]"
      style={{
        backgroundImage: `url('https://i.imgur.com/mUVIGeu.jpeg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content container that scrolls over the fixed background */}
      <div className="relative z-10 min-h-[400px] md:min-h-[450px] lg:min-h-[500px] flex items-center justify-center md:justify-start px-4 md:px-8 lg:px-20 py-12">
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="max-w-xl bg-background/70 p-8 md:p-12 rounded-2xl shadow-elevated"
        >
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-6">
            Our Story
          </h2>
          <div className="space-y-4 text-muted-foreground text-base md:text-lg leading-relaxed">
            <p>
              Nestled in Maslog, Danao City, Cebu, Hilomè Wellness Resort is a sanctuary where healing begins in silence.
            </p>
            <p>
              Founded by Dr. Herbert Ryan Cruz of Cruzskin Medical and Aesthetic Center, Hilomè draws its name from the Filipino word "Hilom" (healing) and "È" (Elegance)—embodying wellness delivered with grace and sophistication, rooted in Filipino heritage.
            </p>
          </div>
          <div className="mt-8">
            <Link to="/our-story">
              <Button
                size="lg"
                className="gradient-accent text-accent-foreground hover:opacity-90 rounded-full px-8 text-base transition-all hover:scale-105 hover:shadow-lg"
              >
                Read More
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default OurStory;