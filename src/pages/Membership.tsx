import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const MembershipPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6"
          >
            <Link to="/">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Join the HCIBiz Community
            </h1>
            <p className="text-muted-foreground text-lg mb-8">
              Start your wellness business journey with Health Code International
            </p>

            <div className="bg-card rounded-2xl p-8 shadow-elevated">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-6">
                Benefits of Joining
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6 text-left mb-8">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full gradient-accent flex items-center justify-center flex-shrink-0">
                    <span className="text-primary-foreground font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Earn While Healing</h3>
                    <p className="text-sm text-muted-foreground">Help others achieve wellness while building your income</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full gradient-accent flex items-center justify-center flex-shrink-0">
                    <span className="text-primary-foreground font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Product Discounts</h3>
                    <p className="text-sm text-muted-foreground">Exclusive member pricing on all HCIBiz products</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full gradient-accent flex items-center justify-center flex-shrink-0">
                    <span className="text-primary-foreground font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Training and Support</h3>
                    <p className="text-sm text-muted-foreground">Complete mentorship and business training</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full gradient-accent flex items-center justify-center flex-shrink-0">
                    <span className="text-primary-foreground font-bold">4</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Growing Network</h3>
                    <p className="text-sm text-muted-foreground">Join a nationwide community of wellness advocates</p>
                  </div>
                </div>
              </div>

              <p className="text-muted-foreground mb-6">
                Interested in becoming a member? Fill out the inquiry form on our homepage or contact us directly.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/book-consultation">
                  <Button className="gradient-accent text-primary-foreground rounded-full px-8">
                    Inquire Now
                  </Button>
                </Link>
                <Link to="/book-consultation">
                  <Button variant="outline" className="border-primary text-primary rounded-full px-8">
                    Book Consultation
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MembershipPage;
