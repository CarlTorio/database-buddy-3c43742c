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
    if (window.innerWidth < 768) {
      document.body.style.overflow = 'hidden';

      const stage1Timer = setTimeout(() => {
        setAnimationStage('white-fading');
        
        const startTime = Date.now();
        const duration = 1000;
        
        const animateFadeIn = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          setWhiteOpacity(progress * 0.7);
          setTextOpacity(progress);
          
          if (progress < 1) {
            requestAnimationFrame(animateFadeIn);
          } else {
            setAnimationStage('buttons-sliding');
            setTimeout(() => {
              setButtonsVisible(true);
              
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
      setWhiteOpacity(0);
      setTextOpacity(1);
      setButtonsVisible(true);
      setAnimationStage('complete');
    }
  }, []);

  const displayWhiteOpacity = isMobile ? whiteOpacity : 0;
  const displayTextOpacity = isMobile ? textOpacity : 1;
  const displayButtonsVisible = isMobile ? buttonsVisible : true;

  return (
    <section className="relative min-h-[60vh] md:min-h-[85vh] flex items-center overflow-hidden pt-8 md:pt-0">
      {/* Background Image */}
      <motion.div 
        className="absolute inset-0 z-0" 
        initial={{ scale: 1.1 }} 
        animate={{ scale: 1 }} 
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent z-10" />
        <img
          src="/hero-bg.png"
          alt="Holistic wellness treatment"
          className="w-full h-full object-cover object-[80%_center] md:object-center"
        />
      </motion.div>

      {/* White Overlay - Mobile only */}
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
          <motion.div 
            initial={{ opacity: 0, y: 40 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 2.3 }}
            style={{ 
              opacity: displayTextOpacity,
              transition: 'opacity 0.1s ease-out'
            }}
          >
            <p className="text-sm md:text-base font-medium text-primary tracking-wide uppercase mb-2">
              Holistic Healing, Modern Wellness
            </p>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-3 md:mb-4">
              Your Path to Natural Health and Recovery
            </h1>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 2.5 }} 
            className="text-muted-foreground text-base sm:text-lg md:text-xl max-w-md mb-5 md:mb-6 leading-relaxed"
            style={{ 
              opacity: displayTextOpacity,
              transition: 'opacity 0.1s ease-out'
            }}
          >
            Advanced holistic treatments and traditional healing methods by Esperanza Lopez. Serving Novaliches, Quezon City.
          </motion.p>

          {/* Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 2.7 }}
            className={`flex flex-wrap gap-3 transition-all duration-500 ease-out ${
              displayButtonsVisible 
                ? 'translate-y-0 opacity-100' 
                : 'translate-y-8 opacity-0 md:translate-y-0 md:opacity-100'
            }`}
          >
            <Button asChild size="default" className="gradient-accent text-primary-foreground hover:opacity-90 transition-all duration-300 hover:scale-105 px-4 md:px-6 py-2 md:py-3 text-sm md:text-base rounded-full">
              <Link to="/book-consultation">Book Consultation</Link>
            </Button>
            <Button asChild size="default" variant="outline" className="border-primary text-primary hover:bg-primary/5 px-4 md:px-6 py-2 md:py-3 text-sm md:text-base rounded-full">
              <Link to="/membership">Join Now</Link>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      {(animationStage === 'complete' || !isMobile) && (
        <motion.div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20" 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: isMobile ? 0 : 3.2 }}
        >
          <motion.div 
            animate={{ y: [0, 10, 0] }} 
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} 
            className="w-6 h-10 border-2 border-foreground/30 rounded-full flex items-start justify-center p-2"
          >
            <motion.div 
              animate={{ y: [0, 8, 0] }} 
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} 
              className="w-1.5 h-3 bg-foreground/50 rounded-full" 
            />
          </motion.div>
        </motion.div>
      )}
    </section>
  );
};

export default Hero;
