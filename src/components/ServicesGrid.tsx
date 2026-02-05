import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import auriculoImg from "@/assets/service-auriculo.png";
import bioresonatorImg from "@/assets/service-bioresonator.png";
import laserAcupunctureImg from "@/assets/service-laser-acupuncture.png";
import cuppingImg from "@/assets/service-cupping.png";
import moxibustionImg from "@/assets/service-moxibustion.png";
import guashaImg from "@/assets/service-guasha.png";
import electroAcupunctureImg from "@/assets/service-electro-acupuncture.png";
import strokeImg from "@/assets/service-stroke.png";
import sciaticaImg from "@/assets/service-sciatica.png";
import frozenShoulderImg from "@/assets/service-frozen-shoulder.png";
import backPainImg from "@/assets/service-back-pain.png";
import sprainImg from "@/assets/service-sprain.png";
import scoliosisImg from "@/assets/service-scoliosis.png";
import boneImg from "@/assets/service-bone.png";
import nerveImg from "@/assets/service-nerve.png";

const holisticServices = [
  { title: "Stroke Management", description: "Rehabilitation and recovery support through holistic methods", image: strokeImg },
  { title: "Sciatica Remedies", description: "Natural pain relief for sciatic nerve conditions", image: sciaticaImg },
  { title: "Frozen Shoulder", description: "Restore mobility and reduce shoulder pain", image: frozenShoulderImg },
  { title: "Body/Back Pain", description: "Targeted relief for chronic body and back pain", image: backPainImg },
  { title: "Sprain Recovery", description: "Traditional healing methods for sprains and joint injuries", image: sprainImg },
  { title: "Scoliosis Management", description: "Holistic approach to spinal alignment and pain relief", image: scoliosisImg },
  { title: "Bone Manipulation", description: "Manual adjustment techniques for skeletal alignment", image: boneImg },
  { title: "Nerve Therapy", description: "Specialized treatment for nerve-related conditions", image: nerveImg },
  { title: "Filipino Hilot", description: "Traditional Filipino healing massage passed down through generations", image: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=400&h=500&fit=crop" },
];

const tcmServices = [
  { title: "Auriculo Therapy", description: "Ear acupuncture therapy for various health conditions", image: auriculoImg },
  { title: "Guasha Therapy", description: "Scraping technique to improve circulation and relieve pain", image: guashaImg },
  { title: "Moxibustion", description: "Heat therapy using dried herbs to stimulate healing", image: moxibustionImg },
  { title: "Cupping / Ventoza", description: "Suction therapy to promote blood flow and reduce tension", image: cuppingImg },
  { title: "Electro Acupuncture", description: "Enhanced acupuncture with mild electrical stimulation", image: electroAcupunctureImg },
  { title: "Laser Acupuncture", description: "Non-invasive laser-based acupuncture treatment", image: laserAcupunctureImg },
  { title: "Bioresonator", description: "Frequency-based therapy for cellular health restoration", image: bioresonatorImg },
];

const ServiceCard = ({ service, index, isInView }: { service: typeof holisticServices[0]; index: number; isInView: boolean }) => (
  <motion.div
    initial={{ opacity: 0, y: -60 }}
    animate={isInView ? { opacity: 1, y: 0 } : {}}
    transition={{ 
      duration: 2.5, 
      delay: index * 0.15,
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
    
    {/* Default gradient */}
    <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/50 via-25% to-transparent to-50% group-hover:opacity-0 transition-opacity duration-300" />
    
    {/* Hover gradient */}
    <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/60 to-primary/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    
    {/* Default text */}
    <div className="absolute bottom-0 left-0 right-0 p-2 md:p-3 text-center group-hover:opacity-0 transition-opacity duration-300">
      <h3 className="font-display text-[10px] sm:text-xs md:text-sm lg:text-base font-semibold text-primary-foreground mb-0.5">
        {service.title}
      </h3>
      <p className="text-[8px] sm:text-[9px] md:text-xs text-primary-foreground/80 leading-tight line-clamp-2">
        {service.description}
      </p>
    </div>
    
    {/* Hover text */}
    <div className="absolute inset-0 flex flex-col items-center justify-center p-2 md:p-3 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <h3 className="font-display text-[10px] sm:text-xs md:text-sm lg:text-base font-semibold text-primary-foreground mb-1">
        {service.title}
      </h3>
      <p className="text-[8px] sm:text-[9px] md:text-xs text-primary-foreground/90 leading-tight px-1">
        {service.description}
      </p>
    </div>
  </motion.div>
);

const ServicesGrid = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });
  const [activeTab, setActiveTab] = useState("holistic");

  return (
    <section id="services" className="py-10 md:py-14 bg-muted scroll-mt-24" ref={ref}>
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
            Traditional healing methods and advanced wellness treatments. Discover your path to natural health.
          </p>
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-6 md:mb-8">
            <TabsTrigger value="holistic" className="text-xs md:text-sm">Holistic Wellness</TabsTrigger>
            <TabsTrigger value="tcm" className="text-xs md:text-sm">Traditional Chinese Med</TabsTrigger>
          </TabsList>
          
          <TabsContent value="holistic">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3 lg:gap-4 max-w-5xl mx-auto">
              {holisticServices.map((service, index) => (
                <ServiceCard key={service.title} service={service} index={index} isInView={isInView} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="tcm">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3 lg:gap-4 max-w-5xl mx-auto">
              {tcmServices.map((service, index) => (
                <ServiceCard key={service.title} service={service} index={index} isInView={isInView} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default ServicesGrid;
