import { useEffect } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const OurStory = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cream to-background" />
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
          <svg viewBox="0 0 400 400" className="w-full h-full">
            <path
              d="M50,200 Q150,100 250,200 T450,200"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-accent"
            />
            <path
              d="M50,250 Q150,150 250,250 T450,250"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className="text-accent"
            />
          </svg>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold text-foreground mb-6">
              Hilomè Wellness Resort
            </h1>
            <p className="text-lg md:text-xl text-accent font-display italic">
              Our Story
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Introduction */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-6">
                Nestled in the serene coastal town of Maslog, Danao City, Cebu, Hilomè Wellness Resort was born from a vision to create more than just a destination—a sanctuary where healing begins in silence.
              </p>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                Founded by Dr. Herbert Ryan Cruz of Cruzskin Medical and Aesthetic Center, Hilomè embodies a philosophy deeply rooted in Filipino heritage. The name itself draws inspiration from the Filipino word "Hilom," meaning healing, paired with "È" for Elegance—representing our commitment to the art of wellness delivered with grace and sophistication.
              </p>
            </motion.div>

            {/* Section: Where Science Meets Serenity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-[2px] gradient-accent" />
                <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground">
                  Where Science Meets Serenity
                </h2>
              </div>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed pl-16">
                At Hilomè, we believe that true wellness emerges from the harmony of mind, body, and spirit. Our resort is thoughtfully designed as a space where science meets nature, aesthetics meet wellness, and luxury meets tranquility. Every detail—from the calming scent of essential oils to the gentle sound of waves at sunset—is intentionally curated to restore balance and renew your spirit.
              </p>
            </motion.div>

            {/* Section: The Art of Healing in Silence */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-[2px] gradient-accent" />
                <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground">
                  The Art of Healing in Silence
                </h2>
              </div>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed pl-16">
                In today's fast-paced world, silence is not emptiness but a powerful space for restoration. Surrounded by nature's beauty and inspired by the tranquil shores of Danao, Hilomè invites you to pause, breathe, and reconnect with yourself. Here, healing is an art form—a journey of restoration that honors both tradition and innovation.
              </p>
            </motion.div>

            {/* Section: A Holistic Sanctuary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-[2px] gradient-accent" />
                <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground">
                  A Holistic Sanctuary
                </h2>
              </div>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed pl-16">
                Our offerings reflect a complete approach to wellness: from relaxation spa services and medical wellness treatments to nourishing café cuisine and transformative lifestyle experiences like yoga and wellness drips. With future expansions planned to include saunas, ice baths, and jacuzzis, Hilomè continues to evolve as Cebu's premier wellness destination.
              </p>
            </motion.div>

            {/* Section: Join the Hilomè Circle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-[2px] gradient-accent" />
                <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground">
                  Join the Hilomè Circle
                </h2>
              </div>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed pl-16">
                We welcome you to become part of our founding community—a circle of individuals who value wellness, elegance, and the transformative power of silence. As a member, you'll enjoy exclusive access to our sanctuary, priority services, and the opportunity to turn dreams into reality alongside us.
              </p>
            </motion.div>

            {/* Closing Statement */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center py-12 border-t border-b border-border"
            >
              <p className="text-lg md:text-xl text-foreground font-display italic mb-6">
                Hilomè Wellness Resort – Where nature, wellness, and tranquility come together.
                <br />
                Where every moment is an invitation to heal.
              </p>
              <div className="flex items-center justify-center gap-4 md:gap-8">
                <span className="text-sm md:text-base font-semibold text-accent tracking-widest">WELLNESS</span>
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                <span className="text-sm md:text-base font-semibold text-accent tracking-widest">AESTHETIC</span>
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                <span className="text-sm md:text-base font-semibold text-accent tracking-widest">LIFESTYLE</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default OurStory;
