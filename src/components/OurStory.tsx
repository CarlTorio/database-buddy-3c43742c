import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const storyImages = [
  "https://i.imgur.com/mUVIGeu.jpeg",
  "https://i.imgur.com/XWTQjvN.jpeg",
  "https://i.imgur.com/eaexp29.jpeg",
  "https://i.imgur.com/bYBt8fD.jpeg",
];

const OurStory = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="min-h-[400px] md:min-h-[450px] lg:min-h-[500px] bg-secondary text-primary-foreground relative overflow-hidden" ref={ref}>
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
        <svg viewBox="0 0 400 400" className="w-full h-full">
          <path
            d="M50,200 Q150,100 250,200 T450,200"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-accent"
          />
          <path
            d="M50,250 Q150,150 250,250 T450,250"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-accent"
          />
        </svg>
      </div>

      {/* Full-width Image with Gradient Overlay */}
      <div className="absolute inset-0">
        <Carousel
          opts={{
            loop: true,
            dragFree: true,
          }}
          plugins={[
            Autoplay({
              delay: 3000,
              stopOnInteraction: false,
              stopOnMouseEnter: true,
            }),
          ]}
          className="w-full h-full"
        >
          <CarouselContent className="h-full">
            {storyImages.map((src, index) => (
              <CarouselItem key={index} className="h-full">
                <img
                  src={src}
                  alt={`SkinStation Clinic ${index + 1}`}
                  className="w-full h-full object-cover object-[center_90%]"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        {/* Gradient Overlay - transparent left to dark right */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-secondary/70 to-secondary" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex justify-end">
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="relative z-10 lg:w-1/2 py-8 md:py-12"
          >
            <h2 className="font-display text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold text-primary-foreground mb-3 md:mb-4">
              Our Story
            </h2>
            <div className="space-y-2 md:space-y-3 text-primary-foreground/80 text-xs md:text-sm lg:text-base leading-relaxed">
              <p>
                Nestled in Maslog, Danao City, Cebu, Hilomè Wellness Resort is a sanctuary where healing begins in silence.
              </p>
              <p>
                Founded by Dr. Herbert Ryan Cruz of Cruzskin Medical and Aesthetic Center, Hilomè draws its name from the Filipino word "Hilom" (healing) and "È" (Elegance)—embodying wellness delivered with grace and sophistication, rooted in Filipino heritage.
              </p>
            </div>
            <div className="mt-6">
              <Link to="/our-story">
                <Button
                  size="default"
                  className="gradient-accent text-accent-foreground hover:opacity-90 rounded-full px-6 text-sm transition-transform hover:scale-105"
                >
                  Read More
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default OurStory;
