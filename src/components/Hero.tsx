import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const Hero = () => {
  const [animationStage, setAnimationStage] = useState('initial');
  const [whiteOpacity, setWhiteOpacity] = useState(0);
  const [textOpacity, setTextOpacity] = useState(0);
  const [buttonsVisible, setButtonsVisible] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    // Only run cinematic intro on mobile
    if (window.innerWidth < 768) {
      // Lock scroll initially
      document.body.style.overflow = 'hidden';

      // Stage 1: Wait 1.5s with background visible
      const stage1Timer = setTimeout(() => {
        setAnimationStage('white-fading');
        
        // Animate white overlay and text together over 1 second
        const startTime = Date.now();
        const duration = 1000;
        
        const animateFadeIn = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          setWhiteOpacity(progress * 0.7); // 0 to 0.7
          setTextOpacity(progress); // 0 to 1
          
          if (progress < 1) {
            requestAnimationFrame(animateFadeIn);
          } else {
            // Stage 2: Show buttons after text is visible
            setAnimationStage('buttons-sliding');
            setTimeout(() => {
              setButtonsVisible(true);
              
              // Stage 3: Complete - unlock scroll after buttons appear
              setTimeout(() => {
                setAnimationStage('complete');
                document.body.style.overflow = 'auto';
              }, 500);
            }, 100);
          }
        };
        
        requestAnimationFrame(animateFadeIn);
      }, 2500);

      return () => {
        clearTimeout(stage1Timer);
        document.body.style.overflow = 'auto';
      };
    } else {
      // Desktop: show everything immediately
      setWhiteOpacity(0);
      setTextOpacity(1);
      setButtonsVisible(true);
      setAnimationStage('complete');
    }
  }, []);

  // Desktop always shows content
  const displayWhiteOpacity = isMobile ? whiteOpacity : 0;
  const displayTextOpacity = isMobile ? textOpacity : 1;
  const displayButtonsVisible = isMobile ? buttonsVisible : true;

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

      {/* White Overlay - Fades IN during cinematic intro (mobile only) */}
      <div 
        className="absolute inset-0 z-[5] bg-white md:hidden pointer-events-none"
        style={{ 
          opacity: displayWhiteOpacity,
          transition: 'opacity 0.1s ease-out'
        }}
      />

      {/* Bottom fade gradient - mobile only */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent z-[15] md:hidden pointer-events-none" />

      {/* Content */}
      <div className="container mx-auto px-4 relative z-20">
        <div className="max-w-xl ml-4 md:ml-12">
          {/* Text content that fades IN on mobile */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{ 
              opacity: displayTextOpacity,
              transition: 'opacity 0.1s ease-out'
            }}
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
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.5 }} 
            className="text-muted-foreground text-base sm:text-lg md:text-xl max-w-md mb-5 md:mb-6 leading-relaxed lg:text-xl"
            style={{ 
              opacity: displayTextOpacity,
              transition: 'opacity 0.1s ease-out'
            }}
          >
            Your destination for advanced skincare and aesthetic treatments. Elevate your beauty and well-being with us.
          </motion.p>

          {/* Buttons - Slide up from bottom on mobile */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.7 }} 
            className={`flex flex-wrap gap-3 transition-all duration-500 ease-out ${
              displayButtonsVisible 
                ? 'translate-y-0 opacity-100' 
                : 'translate-y-8 opacity-0 md:translate-y-0 md:opacity-100'
            }`}
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

      {/* Decorative scroll indicator - shows after animation completes on mobile */}
      {(animationStage === 'complete' || !isMobile) && (
        <motion.div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20" initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} transition={{
          delay: isMobile ? 0 : 1.2
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
      )}
    </section>;
};
export default Hero;