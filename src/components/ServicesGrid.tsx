import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import serviceLaser from "@/assets/service-laser.jpg";
import serviceFacial from "@/assets/service-facial.jpg";
import serviceSlimming from "@/assets/service-slimming.jpg";
import serviceDiamondPeel from "@/assets/service-diamond-peel.jpg";
import serviceWhitening from "@/assets/service-whitening.jpg";
import serviceAcne from "@/assets/service-acne.jpg";
import serviceAntiaging from "@/assets/service-antiaging.jpg";

const allServices = [
  { title: "4D Quadro Laser", image: serviceLaser },
  { title: "2025 Laser", image: serviceFacial },
  { title: "Facials and Peels", image: serviceDiamondPeel },
  { title: "Aqua-Skin Medical Procedures", image: serviceWhitening },
  { title: "Slimming and Firming", image: serviceSlimming },
  { title: "Anti-Acne Treatments", image: serviceAcne },
  { title: "Whitening Treatments", image: serviceWhitening },
  { title: "Anti-Aging Treatments", image: serviceAntiaging },
];

const ServicesGrid = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section id="services" className="py-10 md:py-14 bg-cream" ref={ref}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-6 md:mb-8 max-w-2xl mx-auto"
        >
          <h2 className="font-display text-xl md:text-2xl lg:text-3xl font-semibold text-foreground mb-2 md:mb-3">
            Our Services
          </h2>
          <p className="text-muted-foreground text-xs md:text-sm lg:text-base leading-relaxed px-2">
            Science-backed treatments performed by trained experts. Discover your path to radiant skin.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-3 md:grid-cols-4 gap-2 md:gap-3 max-w-3xl mx-auto">
          {allServices.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-lg md:rounded-xl aspect-square cursor-pointer"
              whileHover={{ y: -8 }}
            >
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 gradient-card-overlay opacity-70 group-hover:opacity-85 transition-opacity duration-300" />
              
              <div className="absolute inset-0 flex flex-col items-center justify-center p-2 md:p-3 text-center">
                <h3 className="font-display text-[10px] sm:text-xs md:text-sm lg:text-base font-semibold text-accent-foreground mb-1">
                  {service.title}
                </h3>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  <span className="text-xs text-accent-foreground/80 underline underline-offset-4">
                    Learn More
                  </span>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesGrid;
