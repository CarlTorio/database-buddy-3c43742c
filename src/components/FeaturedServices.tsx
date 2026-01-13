import { motion, useScroll, useTransform } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";

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

const ServiceCard = ({ service, index, isInView }: { service: typeof services[0], index: number, isInView: boolean }) => {
  const cardRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [30, -30]);
  
  // For 3-column grid: left (0), center (1), right (2)
  const isLeftColumn = index === 0;
  const isRightColumn = index === 2;
  
  const getInitialX = () => {
    if (isLeftColumn) return -100;
    if (isRightColumn) return 100;
    return 0;
  };

  return (
    <motion.div 
      ref={cardRef}
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
        duration: 1.2,
        delay: index * 0.15,
        ease: [0.25, 0.1, 0.25, 1]
      }} 
      className="group relative overflow-hidden rounded-lg md:rounded-xl aspect-[4/5] cursor-pointer" 
      whileHover={{
        y: -8
      }}
    >
      <motion.img 
        src={service.image} 
        alt={service.title} 
        className="w-full h-full object-cover scale-110"
        style={{ y }}
      />
      
      {/* Default gradient - bottom half */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/50 via-25% to-transparent to-50% group-hover:opacity-0 transition-opacity duration-300" />
      
      {/* Hover gradient - full cover */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/60 to-primary/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Default text position - bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-3 md:p-5 text-accent-foreground group-hover:opacity-0 transition-opacity duration-300">
        <h3 className="font-display text-base md:text-lg lg:text-xl font-semibold mb-1 leading-tight">
          {service.title}
        </h3>
        <p className="text-accent-foreground/80 text-xs md:text-sm leading-relaxed">
          {service.description}
        </p>
      </div>
      
      {/* Hover text position - centered */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-3 md:p-5 text-accent-foreground text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <h3 className="font-display text-base md:text-lg lg:text-xl font-semibold mb-2 leading-tight">
          {service.title}
        </h3>
        <p className="text-accent-foreground/90 text-xs md:text-sm leading-relaxed max-w-[90%]">
          {service.description}
        </p>
      </div>
    </motion.div>
  );
};

const FeaturedServices = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    amount: 0.3
  });

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

        {/* Services Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-3 md:gap-4 lg:gap-5 max-w-4xl mx-auto">
          {services.map((service, index) => (
            <ServiceCard 
              key={service.title} 
              service={service} 
              index={index} 
              isInView={isInView} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedServices;