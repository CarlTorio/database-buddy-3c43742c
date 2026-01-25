import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Instagram, Facebook, Mail, Phone, MapPin, Clock } from "lucide-react";

const ContactSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-50px" });

  return (
    <section className="py-6 md:py-8 bg-cream" ref={ref} id="contact">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-4 md:mb-6"
        >
          <h2 className="font-display text-lg md:text-xl lg:text-2xl font-semibold text-foreground mb-1 md:mb-2">
            Get In Touch
          </h2>
          <p className="text-muted-foreground text-[10px] md:text-xs lg:text-sm max-w-md mx-auto px-2">
            Visit us or reach out through any of our channels.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
          {/* Contact Info & Social Media */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-3"
          >
            {/* Contact Details */}
            <div className="bg-card rounded-lg md:rounded-xl p-3 md:p-4 shadow-soft">
              <h3 className="font-display text-sm md:text-base font-semibold text-foreground mb-2">
                Contact Information
              </h3>
              <div className="space-y-2">
                <a 
                  href="tel:09773344200" 
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
                >
                  <div className="w-7 h-7 gradient-accent rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Phone className="w-3 h-3 text-accent-foreground" />
                  </div>
                  <span className="text-xs md:text-sm">0977 334 4200</span>
                </a>
                <a 
                  href="mailto:cruzskin@gmail.com" 
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
                >
                  <div className="w-7 h-7 gradient-accent rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Mail className="w-3 h-3 text-accent-foreground" />
                  </div>
                  <span className="text-xs md:text-sm">cruzskin@gmail.com</span>
                </a>
                <a 
                  href="https://maps.app.goo.gl/8cncKgXznqJqrz4UA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 text-muted-foreground hover:text-foreground transition-colors group"
                >
                  <div className="w-7 h-7 gradient-accent rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <MapPin className="w-3 h-3 text-accent-foreground" />
                  </div>
                  <span className="text-xs md:text-sm">6014 Mandaue City, Philippines</span>
                </a>
                <div className="flex items-start gap-2 text-muted-foreground">
                  <div className="w-7 h-7 gradient-accent rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-3 h-3 text-accent-foreground" />
                  </div>
                  <div className="text-xs md:text-sm">
                    <p>Mon - Sat: 9:00 AM - 7:00 PM</p>
                    <p>Sunday: 10:00 AM - 5:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-card rounded-lg md:rounded-xl p-3 md:p-4 shadow-soft">
              <h3 className="font-display text-sm md:text-base font-semibold text-foreground mb-2">
                Follow Us
              </h3>
              <div className="flex gap-3">
                <a
                  href="https://www.facebook.com/profile.php?id=61580172268741"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 gradient-accent rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                >
                  <Facebook className="w-4 h-4 text-accent-foreground" />
                </a>
                <a
                  href="https://instagram.com/hilome"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 gradient-accent rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                >
                  <Instagram className="w-4 h-4 text-accent-foreground" />
                </a>
              </div>
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                <a
                  href="https://www.facebook.com/profile.php?id=61580172268741"
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
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-[200px] md:h-full min-h-[250px] rounded-lg md:rounded-xl overflow-hidden shadow-soft relative group"
          >
            <a
              href="https://maps.app.goo.gl/8cncKgXznqJqrz4UA"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-0 z-10 flex items-center justify-center bg-foreground/0 hover:bg-foreground/10 transition-colors"
            >
              <span className="sr-only">Open in Google Maps for directions</span>
            </a>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3925.1234567!2d123.9369!3d10.3321!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33a999258dce37c7%3A0x1234567890abcdef!2s6014%20Mandaue%20City%2C%20Cebu%2C%20Philippines!5e0!3m2!1sen!2sph!4v1234567890!5m2!1sen!2sph&markers=color:red%7C10.3321,123.9369"
              width="100%"
              height="100%"
              style={{ border: 0, pointerEvents: 'none' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Hilomè Location - Mandaue City"
              className="w-full h-full"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
