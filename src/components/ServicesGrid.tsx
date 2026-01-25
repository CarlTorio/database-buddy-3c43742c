import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const allServices = [
  { title: "Cafe by The Beach", description: "Enjoy healthy refreshments and snacks with ocean views.", longDescription: "Enjoy healthy refreshments and snacks with stunning ocean views. Our café offers organic juices, wellness teas, and nutritious bites to complement your spa experience.", image: "https://i.imgur.com/vjcLpp8.jpeg" },
  { title: "Detox & Slimming", description: "Body contouring and detoxifying treatments for a healthier you.", longDescription: "Transform your body with our comprehensive detox and slimming programs. Featuring advanced body contouring, lymphatic drainage, and detoxifying wraps for lasting results.", image: "https://i.imgur.com/UKZXsAI.png" },
  { title: "Head Spa", description: "Scalp therapy and hair treatments for ultimate relaxation.", longDescription: "Experience deep scalp therapy and revitalizing hair treatments. Our head spa combines aromatherapy, massage, and nourishing treatments for ultimate relaxation and hair health.", image: "https://i.imgur.com/laPHsD7.png" },
  { title: "Body Scrub", description: "Exfoliating treatments to reveal smooth, glowing skin.", longDescription: "Reveal your skin's natural radiance with our luxurious body scrubs. Using natural exfoliants and nourishing oils to leave your skin silky smooth and deeply moisturized.", image: "https://i.imgur.com/naDyJ5P.png" },
  { title: "Yoga", description: "Mindful movement sessions to restore balance and flexibility.", longDescription: "Join our expert-led yoga sessions designed to restore balance, improve flexibility, and calm the mind. Classes suitable for all levels in our serene beachfront studio.", image: "https://i.imgur.com/Up1lvBw.png" },
  { title: "Massage", description: "Therapeutic massages to relieve tension and promote wellness.", longDescription: "Indulge in therapeutic massages tailored to your needs. From deep tissue to aromatherapy, our skilled therapists relieve tension and restore your body's natural harmony.", image: "https://i.imgur.com/LXAK7wa.png" },
  { title: "Wellness Drips", description: "IV vitamin therapy for energy, immunity and rejuvenation.", longDescription: "Boost your wellness with our IV vitamin therapy. Customized drips for energy, immunity, hydration, and rejuvenation—delivered directly to your system for maximum absorption.", image: "https://i.imgur.com/FzFbPt9.png" },
  { title: "Facials", description: "Advanced skincare treatments for a radiant complexion.", longDescription: "Achieve a radiant complexion with our advanced facial treatments. Using premium products and cutting-edge techniques to address your unique skin concerns.", image: "https://i.imgur.com/bXaHFzI.png" },
];

const ServicesGrid = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });

  return (
    <section id="services" className="py-10 md:py-14 bg-cream scroll-mt-24" ref={ref}>
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 lg:gap-4 max-w-4xl mx-auto">
          {allServices.map((service, index) => {
            return (
              <motion.div
                key={service.title}
                initial={{ 
                  opacity: 0, 
                  y: -60
                }}
                animate={isInView ? { 
                  opacity: 1, 
                  y: 0
                } : {}}
                transition={{ 
                  duration: 2.5, 
                  delay: index * 0.25,
                  ease: [0.25, 0.1, 0.25, 1]
                }}
                className="group relative overflow-hidden rounded-lg md:rounded-xl aspect-[4/5] cursor-pointer"
                whileHover={{ y: -8 }}
              >
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Default gradient - bottom half */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/50 via-25% to-transparent to-50% group-hover:opacity-0 transition-opacity duration-300" />
                
                {/* Hover gradient - full cover */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/60 to-primary/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Default text position - bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-2 md:p-3 text-center group-hover:opacity-0 transition-opacity duration-300">
                  <h3 className="font-display text-[10px] sm:text-xs md:text-sm lg:text-base font-semibold text-accent-foreground mb-0.5">
                    {service.title}
                  </h3>
                  <p className="text-[8px] sm:text-[9px] md:text-xs text-accent-foreground/80 leading-tight line-clamp-2">
                    {service.description}
                  </p>
                </div>
                
                {/* Hover text position - centered */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-2 md:p-3 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h3 className="font-display text-[10px] sm:text-xs md:text-sm lg:text-base font-semibold text-accent-foreground mb-1">
                    {service.title}
                  </h3>
                  <p className="text-[8px] sm:text-[9px] md:text-xs text-accent-foreground/90 leading-tight px-1">
                    {service.longDescription}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesGrid;
