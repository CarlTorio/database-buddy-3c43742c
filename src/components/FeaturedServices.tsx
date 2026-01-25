import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const services = [{
  title: "Jacuzzi",
  description: "Relax in our warm therapeutic jets that soothe muscles and promote circulation.",
  image: "https://i.imgur.com/uhJzfTT.png"
}, {
  title: "Ice Bath",
  description: "Invigorating cold therapy to boost recovery, reduce inflammation and energize your body.",
  image: "https://i.imgur.com/HvvXaHz.png"
}, {
  title: "Sauna",
  description: "Detoxify and unwind in our traditional heat therapy for deep relaxation.",
  image: "https://i.imgur.com/7Od95Ti.png"
}];

// Duplicate services for seamless looping on mobile
const duplicatedServices = [...services, ...services, ...services];

const FeaturedServices = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: false,
    amount: 0.3
  });
  const isMobile = useIsMobile();

  // Mobile auto-scroll state
  const [translateX, setTranslateX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef(Date.now());
  const containerRef = useRef<HTMLDivElement>(null);

  // Card width calculation - bigger cards now
  const cardWidth = 200; // width per card including gap
  const totalWidth = services.length * cardWidth;

  // Auto-scroll animation for mobile - continuous infinite scroll
  useEffect(() => {
    if (!isMobile) return;

    const animate = () => {
      if (!isDragging && !isPaused) {
        const now = Date.now();
        const delta = (now - lastTimeRef.current) / 1000;
        lastTimeRef.current = now;
        
        setTranslateX(prev => {
          const newValue = prev - 50 * delta; // Slightly faster
          // Seamlessly reset without visual jump
          if (Math.abs(newValue) >= totalWidth) {
            return newValue % totalWidth;
          }
          return newValue;
        });
      } else {
        lastTimeRef.current = Date.now();
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isDragging, isPaused, isMobile, totalWidth]);

  // Drag handlers for mobile
  const handleStart = (x: number) => {
    setIsDragging(true);
    setIsPaused(true);
    setStartX(x);
    setScrollLeft(translateX);
  };

  const handleMove = (x: number) => {
    if (!isDragging) return;
    setTranslateX(scrollLeft + (x - startX) * 1.5);
  };

  const handleEnd = () => {
    setIsDragging(false);
    setTimeout(() => setIsPaused(false), 3000);
  };

  // Render mobile carousel
  const renderMobileCarousel = () => (
    <div 
      className="overflow-hidden"
      onMouseDown={(e) => handleStart(e.pageX)}
      onMouseMove={(e) => handleMove(e.pageX)}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={(e) => handleStart(e.touches[0].pageX)}
      onTouchMove={(e) => handleMove(e.touches[0].pageX)}
      onTouchEnd={handleEnd}
    >
      <div 
        ref={containerRef}
        className="flex gap-3 cursor-grab active:cursor-grabbing"
        style={{ 
          transform: `translateX(${translateX}px)`,
          transition: isDragging ? 'none' : 'transform 0.1s linear'
        }}
      >
        {duplicatedServices.map((service, index) => (
          <div 
            key={`${service.title}-${index}`}
            className="flex-shrink-0 w-[180px] group relative overflow-hidden rounded-lg aspect-[4/5]"
          >
            <img 
              src={service.image} 
              alt={service.title} 
              className="w-full h-full object-cover"
              draggable={false}
            />
            
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/50 via-25% to-transparent to-50%" />
            
            {/* Text content */}
            <div className="absolute bottom-0 left-0 right-0 p-4 text-accent-foreground">
              <h3 className="font-display text-base font-semibold mb-1 leading-tight">
                {service.title}
              </h3>
              <p className="text-accent-foreground/80 text-xs leading-relaxed line-clamp-2">
                {service.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Render desktop grid
  const renderDesktopGrid = () => (
    <div className="grid grid-cols-3 gap-4 lg:gap-5 max-w-4xl mx-auto">
      {services.map((service, index) => {
        const isLeftColumn = index === 0;
        const isRightColumn = index === 2;
        
        const getInitialX = () => {
          if (isLeftColumn) return -100;
          if (isRightColumn) return 100;
          return 0;
        };

        return (
          <motion.div 
            key={service.title} 
            initial={{
              opacity: 0,
              x: getInitialX()
            }} 
            animate={isInView ? {
              opacity: 1,
              x: 0
            } : {}} 
            transition={{
              duration: 1.8,
              delay: index * 0.2,
              ease: [0.25, 0.1, 0.25, 1]
            }} 
            className="group relative overflow-hidden rounded-xl aspect-[4/5] cursor-pointer" 
            whileHover={{ y: -8 }}
          >
            <img 
              src={service.image} 
              alt={service.title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            
            {/* Default gradient - bottom half */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/50 via-25% to-transparent to-50% group-hover:opacity-0 transition-opacity duration-300" />
            
            {/* Hover gradient - full cover */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/60 to-primary/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Default text position - bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-5 text-accent-foreground group-hover:opacity-0 transition-opacity duration-300">
              <h3 className="font-display text-lg lg:text-xl font-semibold mb-1 leading-tight">
                {service.title}
              </h3>
              <p className="text-accent-foreground/80 text-sm leading-relaxed">
                {service.description}
              </p>
            </div>
            
            {/* Hover text position - centered */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-5 text-accent-foreground text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <h3 className="font-display text-lg lg:text-xl font-semibold mb-2 leading-tight">
                {service.title}
              </h3>
              <p className="text-accent-foreground/90 text-sm leading-relaxed max-w-[90%]">
                {service.description}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );

  return (
    <section className="py-12 md:py-16 bg-background" ref={ref}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={isInView ? { opacity: 1, y: 0 } : {}} 
          transition={{ duration: 0.8 }} 
          className="flex flex-col items-center gap-3 mb-6 md:mb-8"
        >
          <h2 className="font-display text-xl md:text-2xl lg:text-3xl font-semibold text-foreground text-center">
            Future Expansion  
          </h2>
          <motion.a 
            href="#services" 
            className="flex items-center gap-2 text-accent hover:text-accent/80 font-medium transition-colors group text-xs md:text-sm" 
            whileHover={{ x: 5 }}
          >
            See all services
            <ArrowRight className="w-3 h-3 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform" />
          </motion.a>
        </motion.div>

        {/* Services - Mobile Carousel or Desktop Grid */}
        {isMobile ? renderMobileCarousel() : renderDesktopGrid()}
      </div>
    </section>
  );
};

export default FeaturedServices;
