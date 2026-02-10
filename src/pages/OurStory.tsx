import { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CredentialsBadges from "@/components/story/CredentialsBadges";
import StoryGallery from "@/components/story/StoryGallery";
import StoryCTA from "@/components/story/StoryCTA";
import StoryCertificates from "@/components/story/StoryCertificates";

const OurStory = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cream to-background" />
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
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
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <p className="text-accent font-medium tracking-wide uppercase text-sm mb-3">Our Story</p>
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold text-foreground mb-6">
              Esperanza's Holistic Wellness
            </h1>
            <p className="text-lg md:text-xl text-accent font-display italic">
              The Story of Ms. Esperanza T. Lopez NAND
            </p>
            <p className="text-sm md:text-base text-muted-foreground mt-2 tracking-wide">
              HCIBiz CMD North Fairview — Authorized Dealer / Health & Wellness Practitioner
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
                In the heart of Novaliches, Quezon City, Ms. Esperanza T. Lopez NAND — lovingly called "Espie" by her patients — discovered her calling: a passion for natural healing that would transform countless lives. What began as a personal journey toward wellness became a mission to share the gift of holistic health with her community.
              </p>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                Esperanza, whose name means "hope" in Spanish, has always believed that true healing comes from within. Her approach combines time-honored Filipino traditional medicine with modern holistic practices, creating a unique path to wellness that honors both heritage and innovation. As an HCIBiz CMD North Fairview Authorized Dealer and Health & Wellness Practitioner, she stands as an award-winning practitioner recognized for her Excellence in Holistic Healing.
              </p>
            </motion.div>

            {/* Section: A Healer's Beginning */}
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
                  A Healer's Beginning
                </h2>
              </div>
              <div className="pl-0 md:pl-16 space-y-4 text-base md:text-lg text-muted-foreground leading-relaxed">
                <p>
                  Growing up, Esperanza watched her grandmother prepare herbal remedies and perform traditional healing rituals. These early memories planted the seeds of her lifelong dedication to natural wellness. Driven by a desire to help others, she pursued extensive training in holistic healing modalities — from traditional Filipino Hilot massage to Traditional Chinese Medicine techniques including Auriculo Therapy, Guasha, Moxibustion, Cupping, and Acupuncture.
                </p>
                <p>
                  Her dedication led her to complete certifications from Asian Manual International Inc. as an Auriculo Chiro Manual Therapy Practitioner, and she earned the distinguished title of Naturopath Practitioner (NAND). She is a proud member of Asian Manual Therapy International Inc. and PANMED, and received her Doctor of Humanities (Honorary) degree from the Watchman Ministry of Academics — a testament to her commitment to the healing arts and service to humanity.
                </p>
              </div>
            </motion.div>

            {/* Section: The Gift of Healing Hands */}
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
                  The Gift of Healing Hands
                </h2>
              </div>
              <div className="pl-0 md:pl-16 space-y-4 text-base md:text-lg text-muted-foreground leading-relaxed">
                <p>
                  Ms. Esperanza is known for her intuitive touch and compassionate care. Her clients often describe sessions with her as transformative experiences that address not just physical ailments, but emotional and spiritual imbalances as well. She believes that every person carries the power to heal themselves — she simply helps guide them on that journey.
                </p>
                <p>
                  Her expertise spans a wide range of conditions: Stroke Management, Sciatica Remedies, Frozen Shoulder, Body Pain and Back Pain, Sprain Recovery (Tapilok), Scoliosis, Bone Manipulation, and Nerve Therapy. Through Filipino Hilot and Traditional Chinese Medicine techniques, she has helped countless patients find relief and restoration.
                </p>
              </div>
            </motion.div>

            {/* Section: Recognition & Excellence */}
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
                  Recognition & Excellence
                </h2>
              </div>
              <div className="pl-0 md:pl-16 space-y-4 text-base md:text-lg text-muted-foreground leading-relaxed">
                <p>
                  Ms. Esperanza's dedication to holistic healing has not gone unnoticed. On November 22, 2025, she was honored with the prestigious Excellence in Holistic Healing Award by The Great Hashem Corporation at the Auriculo Asian Manual Therapy International Awarding Ceremony held at Eli Josh Resort & Event Place in Silang, Cavite.
                </p>
                <motion.blockquote
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="border-l-4 border-accent pl-6 py-2 my-6 bg-cream/50 rounded-r-lg"
                >
                  <p className="italic text-foreground">
                    "In recognition of your unwavering commitment to the art and science of holistic wellness. Through your skill, compassion, and deep understanding of healing, you have touched lives, restored balance, and inspired others to embrace the journey toward complete well-being. Your work reflects not only professional excellence but also a genuine heart for service, making you a true beacon of healing and harmony."
                  </p>
                  <footer className="mt-3 text-sm text-muted-foreground">
                    — Award Citation, Excellence in Holistic Healing Award
                  </footer>
                </motion.blockquote>
                <p>
                  She also received a Certificate of Appreciation for her valuable participation and support in the wellness community — a recognition of her role as an inspiration to fellow practitioners.
                </p>
              </div>
            </motion.div>

            {/* Section: Philosophy of Wellness */}
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
                  Philosophy of Wellness
                </h2>
              </div>
              <div className="pl-0 md:pl-16 space-y-4 text-base md:text-lg text-muted-foreground leading-relaxed">
                <p>
                  "Healing is not just about treating symptoms," Ms. Esperanza often says. "It's about restoring harmony between body, mind, and spirit." Her practice integrates massage therapy, Traditional Chinese Medicine, herbal treatments, and health supplements to create personalized wellness plans for each client. She treats every individual as a whole person, not just a collection of symptoms.
                </p>
                <p>
                  As the HCIBiz CMD North Fairview Authorized Dealer and NAB International member, as well as a member of Asian Manual Therapy International Inc. and PANMED, she also provides premium health food supplements to complement her therapeutic services — ensuring her patients have access to quality products for their continued wellness journey.
                </p>
              </div>
            </motion.div>

            {/* Section: Serving the Community */}
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
                  Serving the Community
                </h2>
              </div>
              <div className="pl-0 md:pl-16 space-y-4 text-base md:text-lg text-muted-foreground leading-relaxed">
                <p>
                  From her clinic at #60 Forest Hill Drive, Forest Hill Subdivision, Novaliches, Quezon City, Ms. Esperanza has been a trusted healer for her community. Word of her gift has spread through generations of families who have experienced the benefits of her treatments. From chronic pain relief to stroke recovery, from post-surgery rehabilitation to general wellness maintenance, her clients return again and again, often bringing their loved ones along.
                </p>
                <p>
                  Her clinic operates Monday to Saturday, 8:00 AM to 5:00 PM, by appointment only — ensuring each patient receives her full attention and personalized care.
                </p>
              </div>
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
                Esperanza's Holistic Wellness Clinic — Where traditional healing meets modern care.
                <br />
                Your journey to natural health and recovery begins here.
              </p>
              <div className="flex items-center justify-center gap-4 md:gap-8">
                <span className="text-sm md:text-base font-semibold text-accent tracking-widest">HEALING</span>
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                <span className="text-sm md:text-base font-semibold text-accent tracking-widest">TRADITION</span>
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                <span className="text-sm md:text-base font-semibold text-accent tracking-widest">WELLNESS</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Credentials Section */}
      <CredentialsBadges />

      {/* Certificates Section */}
      <StoryCertificates />

      {/* Gallery Section */}
      <StoryGallery />

      {/* CTA Section */}
      <StoryCTA />

      <Footer />
    </div>
  );
};

export default OurStory;
