import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote: "I love your personalized & professional consultations that recommend treatments that are best suited for us... your customer service is awesome too!",
    author: "Odessa Pusta-Rodriguez",
    avatar: "OP",
  },
  {
    quote: "Thank you so much Doc. Herbert Ryan Cruz, you're such a wonderful person for helping me to be confident to talk and to meet with other people. Looking forward for the best result soon!",
    author: "Dranuj Aiponi",
    avatar: "DA",
  },
  {
    quote: "Best services. Super worth it!!!",
    author: "Laarnie Montaño",
    avatar: "LM",
  },
  {
    quote: "So far I'm seeing great results with my friends who have gone to this clinic.",
    author: "Alex Agusti",
    avatar: "AA",
  },
  {
    quote: "Dr. Herbert Ryan Cruz is a living testimony of a man who gives service with passion.. kudos Doc..",
    author: "Yvette Sanchez",
    avatar: "YS",
  },
];

// Duplicate testimonials for seamless loop
const duplicatedTestimonials = [...testimonials, ...testimonials];

const Testimonials = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-10 md:py-14 bg-background overflow-hidden" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="font-display text-lg md:text-2xl lg:text-3xl font-semibold text-foreground text-center mb-6 md:mb-10 px-2"
        >
          Read What They Loved About Hilomè
        </motion.h2>
      </div>

      {/* Carousel Container */}
      <div className="relative w-full overflow-hidden">
        {/* Gradient fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        {/* Scrolling Track */}
        <div className="flex gap-4 md:gap-6 animate-scroll-left hover:[animation-play-state:paused] w-fit">
          {duplicatedTestimonials.map((testimonial, index) => (
            <motion.div
              key={`${testimonial.author}-${index}`}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: (index % testimonials.length) * 0.1 }}
              className="flex-shrink-0 w-[280px] md:w-[350px]"
            >
              <div className="bg-card rounded-xl md:rounded-2xl p-4 md:p-6 shadow-soft hover:shadow-card hover:-translate-y-2 hover:scale-105 transition-all duration-300 h-full cursor-pointer">
                {/* Quote Icon */}
                <div className="mb-3 md:mb-4">
                  <div className="w-8 h-8 md:w-10 md:h-10 gradient-accent rounded-full flex items-center justify-center">
                    <Quote className="w-3 h-3 md:w-4 md:h-4 text-accent-foreground" />
                  </div>
                </div>

                {/* Quote Text */}
                <p className="text-foreground/80 leading-relaxed mb-4 md:mb-6 text-xs md:text-sm lg:text-base italic min-h-[80px] md:min-h-[100px]">
                  "{testimonial.quote}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 gradient-accent rounded-full flex items-center justify-center text-accent-foreground font-semibold text-xs md:text-sm">
                    {testimonial.avatar}
                  </div>
                  <span className="font-semibold text-foreground text-xs md:text-sm">
                    {testimonial.author}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
