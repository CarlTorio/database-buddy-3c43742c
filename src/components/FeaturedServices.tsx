import { motion } from "framer-motion";
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
const FeaturedServices = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    margin: "-100px"
  });
  return <section className="py-12 md:py-16 bg-background" ref={ref}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div initial={{
        opacity: 0,
        y: 30
      }} animate={isInView ? {
        opacity: 1,
        y: 0
      } : {}} transition={{
        duration: 0.6
      }} className="flex flex-col items-center gap-3 mb-6 md:mb-8">
          <h2 className="font-display text-xl md:text-2xl lg:text-3xl font-semibold text-foreground text-center">
            Future Expansion  
          </h2>
          <motion.a href="#services" className="flex items-center gap-2 text-accent hover:text-accent/80 font-medium transition-colors group text-xs md:text-sm" whileHover={{
          x: 5
        }}>
            See all services
            <ArrowRight className="w-3 h-3 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform" />
          </motion.a>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-3 md:gap-4 lg:gap-5 max-w-4xl mx-auto">
          {services.map((service, index) => <motion.div key={service.title} initial={{
          opacity: 0,
          y: 50
        }} animate={isInView ? {
          opacity: 1,
          y: 0
        } : {}} transition={{
          duration: 0.6,
          delay: index * 0.2
        }} className="group relative overflow-hidden rounded-lg md:rounded-xl aspect-[4/5] cursor-pointer" whileHover={{
          scale: 1.02
        }}>
              <img src={service.image} alt={service.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 gradient-card-overlay opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
              
              <div className="absolute bottom-0 left-0 right-0 p-3 md:p-5 text-accent-foreground flex flex-col justify-end">
                <h3 className="font-display text-base md:text-lg lg:text-xl font-semibold mb-1 leading-tight">
                  {service.title}
                </h3>
                <p className="text-accent-foreground/80 text-xs md:text-sm leading-relaxed opacity-100 md:opacity-0 md:group-hover:opacity-100 transform translate-y-0 md:translate-y-4 md:group-hover:translate-y-0 transition-all duration-300 min-h-[2.5rem] md:min-h-0">
                  {service.description}
                </p>
              </div>
            </motion.div>)}
        </div>
      </div>
    </section>;
};
export default FeaturedServices;