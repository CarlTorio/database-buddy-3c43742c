import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import React, { useState, useEffect, useRef } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const Hero = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const isMobile = useIsMobile();
  const touchStartY = useRef(0);

  useEffect(() => {
    // On desktop, skip the reveal animation
    if (!isMobile) {
      setScrollProgress(1);
      setIsRevealed(true);
      return;
    }

    // Lock body scroll on mobile until revealed
    if (!isRevealed) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = '0';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
    };
  }, [isMobile, isRevealed]);

  useEffect(() => {
    if (!isMobile || isRevealed) return;

    const maxScroll = 250;

    const handleWheel = (e: WheelEvent) => {
      if (isRevealed) return;
      e.preventDefault();
      
      setScrollProgress(prev => {
        const newProgress = Math.min(Math.max(prev + (e.deltaY / maxScroll), 0), 1);
        if (newProgress >= 1) {
          setIsRevealed(true);
        }
        return newProgress;
      });
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isRevealed) return;
      e.preventDefault();
      
      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY.current - touchY;
      touchStartY.current = touchY;

      setScrollProgress(prev => {
        const newProgress = Math.min(Math.max(prev + (deltaY / maxScroll), 0), 1);
        if (newProgress >= 1) {
          setIsRevealed(true);
        }
        return newProgress;
      });
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isMobile, isRevealed]);

  // Calculate opacities based on scroll (mobile only)
  const whiteOverlayOpacity = isMobile && !isRevealed ? 0.7 - (scrollProgress * 0.7) : 0;
  const textOpacity = isMobile ? 1 - scrollProgress : 1;

  return <section className="relative min-h-[60vh] md:min-h-[85vh] flex items-center overflow-hidden pt-8 md:pt-0">
      {/* Background Image with Parallax */}
      <motion.div className="absolute inset-0 z-0" initial={{
      scale: 1.1
    }} animate={{
      scale: 1
    }} transition={{
      duration: 1.5,
      ease: "easeOut"
    }}>
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent z-10" />
        <img
          src="https://i.imgur.com/EeiPqJv.jpeg"
          alt="Beautiful women with radiant skin"
          className="w-full h-full object-cover object-[65%_50%] md:object-[70%_50%]"
        />
      </motion.div>

      {/* White Overlay - Fades out on scroll (mobile only) */}
      <div 
        className="absolute inset-0 z-[5] bg-white md:hidden transition-opacity duration-300 pointer-events-none"
        style={{ opacity: whiteOverlayOpacity }}
      />

      {/* Content */}
      <div className="container mx-auto px-4 relative z-20">
        <div className="max-w-xl ml-4 md:ml-12">
          {/* Text content that fades on mobile scroll */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.3 }}
            className="transition-opacity duration-300"
            style={{ opacity: textOpacity }}
          >
            <h1 className="font-script text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-medium text-foreground leading-tight mb-2">
              <span className="non-italic font-sans font-semibold">​The Wellness Escape</span>
            </h1>
            <p className="text-lg sm:text-2xl font-semibold text-foreground tracking-wide uppercase mb-3 md:mb-5 font-sans md:text-4xl">
              FUTURE OF WELLNESS
            </p>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.5 }} 
            className="text-muted-foreground text-base sm:text-lg md:text-xl max-w-md mb-5 md:mb-6 leading-relaxed lg:text-xl transition-opacity duration-300"
            style={{ opacity: textOpacity }}
          >
            Your destination for advanced skincare and aesthetic treatments. Elevate your beauty and well-being with us.
          </motion.p>

          {/* Buttons - Always visible, no fade */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.7 }} 
            className="flex flex-wrap gap-3"
          >
            <Button asChild size="default" className="gradient-accent text-accent-foreground hover:opacity-90 transition-all duration-300 hover:scale-105 px-4 md:px-6 py-2 md:py-3 text-sm md:text-base rounded-full">
              <Link to="/book-consultation">Book Consultation</Link>
            </Button>
            <Button asChild size="default" variant="outline" className="border-foreground/30 text-foreground hover:bg-foreground/5 px-4 md:px-6 py-2 md:py-3 text-sm md:text-base rounded-full">
              <Link to="/membership">Join Now</Link>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Decorative Elements */}
      <motion.div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20" initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} transition={{
      delay: 1.2
    }}>
        <motion.div animate={{
        y: [0, 10, 0]
      }} transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }} className="w-6 h-10 border-2 border-foreground/30 rounded-full flex items-start justify-center p-2">
          <motion.div animate={{
          y: [0, 8, 0]
        }} transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }} className="w-1.5 h-3 bg-foreground/50 rounded-full" />
        </motion.div>
      </motion.div>
    </section>;
};
export default Hero;