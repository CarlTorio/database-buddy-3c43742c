import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Instagram, Facebook, Mail, Phone, MapPin, Clock } from "lucide-react";

const ContactSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section className="py-10 md:py-14 bg-cream" ref={ref} id="contact">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-12"
        >
          <h2 className="font-display text-xl md:text-2xl lg:text-3xl font-semibold text-foreground mb-2 md:mb-3">
            Get In Touch
          </h2>
          <p className="text-muted-foreground text-xs md:text-sm lg:text-base max-w-xl mx-auto px-2">
            Visit us or reach out through any of our channels. We'd love to hear from you!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Contact Info & Social Media */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Contact Details */}
            <div className="bg-card rounded-xl md:rounded-2xl p-5 md:p-6 shadow-soft">
              <h3 className="font-display text-base md:text-lg font-semibold text-foreground mb-4">
                Contact Information
              </h3>
              <div className="space-y-4">
                <a 
                  href="tel:+639123456789" 
                  className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors group"
                >
                  <div className="w-10 h-10 gradient-accent rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Phone className="w-4 h-4 text-accent-foreground" />
                  </div>
                  <span className="text-sm md:text-base">+63 912 345 6789</span>
                </a>
                <a 
                  href="mailto:hello@hilome.ph" 
                  className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors group"
                >
                  <div className="w-10 h-10 gradient-accent rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Mail className="w-4 h-4 text-accent-foreground" />
                  </div>
                  <span className="text-sm md:text-base">hello@hilome.ph</span>
                </a>
                <div className="flex items-start gap-3 text-muted-foreground">
                  <div className="w-10 h-10 gradient-accent rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-accent-foreground" />
                  </div>
                  <span className="text-sm md:text-base">123 Beauty Street, Makati City, Metro Manila, Philippines</span>
                </div>
                <div className="flex items-start gap-3 text-muted-foreground">
                  <div className="w-10 h-10 gradient-accent rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4 text-accent-foreground" />
                  </div>
                  <div className="text-sm md:text-base">
                    <p>Mon - Sat: 9:00 AM - 7:00 PM</p>
                    <p>Sunday: 10:00 AM - 5:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-card rounded-xl md:rounded-2xl p-5 md:p-6 shadow-soft">
              <h3 className="font-display text-base md:text-lg font-semibold text-foreground mb-4">
                Follow Us
              </h3>
              <div className="flex gap-4">
                <a
                  href="https://facebook.com/hilome"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 gradient-accent rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                >
                  <Facebook className="w-5 h-5 text-accent-foreground" />
                </a>
                <a
                  href="https://instagram.com/hilome"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 gradient-accent rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                >
                  <Instagram className="w-5 h-5 text-accent-foreground" />
                </a>
              </div>
              <div className="mt-4 flex flex-wrap gap-3 text-sm">
                <a
                  href="https://facebook.com/hilome"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:text-accent/80 transition-colors"
                >
                  @Hilomè on Facebook
                </a>
                <span className="text-muted-foreground">•</span>
                <a
                  href="https://instagram.com/hilome"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:text-accent/80 transition-colors"
                >
                  @Hilomè on Instagram
                </a>
              </div>
            </div>
          </motion.div>

          {/* Google Map */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="h-[300px] md:h-full min-h-[400px] rounded-xl md:rounded-2xl overflow-hidden shadow-soft"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3861.802547381867!2d121.0194!3d14.5547!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTTCsDMzJzE2LjkiTiAxMjHCsDAxJzA5LjgiRQ!5e0!3m2!1sen!2sph!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Hilomè Location"
              className="w-full h-full"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
