import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Services", path: "/#services" },
    { label: "About Us", path: "/our-story" },
    { label: "Products", path: "/#products" },
    { label: "Membership", path: "/membership" },
    { label: "Bookings", path: "/book-consultation" },
  ];

  const handleNavClick = (path: string) => {
    setIsMobileMenuOpen(false);
    
    if (path.startsWith("/#")) {
      const sectionId = path.substring(2);
      
      if (location.pathname === "/") {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        navigate("/");
        setTimeout(() => {
          const element = document.getElementById(sectionId);
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          }
        }, 100);
      }
    } else {
      navigate(path);
    }
  };

  const handleLogoClick = () => {
    if (location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/");
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-background/95 backdrop-blur-md shadow-soft" : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            {/* Logo */}
            <button
              onClick={handleLogoClick}
              onDoubleClick={() => navigate('/admin')}
              className="flex items-center ml-2 md:ml-12 touch-manipulation cursor-pointer active:scale-95 transition-transform"
            >
              <span className="font-display font-bold text-lg md:text-xl text-primary">
                Esperanza's Holistic Wellness
              </span>
            </button>

            {/* Desktop Navigation */}
            <ul className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <li key={item.label}>
                  <motion.button
                    onClick={() => handleNavClick(item.path)}
                    className="text-foreground/80 hover:text-foreground font-medium transition-colors relative group"
                    whileHover={{ y: -2 }}
                  >
                    {item.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
                  </motion.button>
                </li>
              ))}
            </ul>

            <div className="hidden md:flex items-center gap-4 mr-6 md:mr-12">
              <Button 
                className="gradient-accent text-primary-foreground hover:opacity-90 transition-opacity rounded-full"
                onClick={() => navigate("/book-consultation")}
              >
                Book Consultation
              </Button>
              <Button 
                variant="outline"
                className="border-primary text-primary hover:bg-primary/5 rounded-full"
                onClick={() => {
                  if (location.pathname === "/") {
                    document.getElementById("membership-inquiry")?.scrollIntoView({ behavior: "smooth" });
                  } else {
                    navigate("/");
                    setTimeout(() => {
                      document.getElementById("membership-inquiry")?.scrollIntoView({ behavior: "smooth" });
                    }, 100);
                  }
                }}
              >
                Join Now
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden mr-2 text-foreground"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </nav>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-background border-t border-border"
            >
              <div className="container mx-auto px-4 py-6">
                <ul className="flex flex-col gap-4">
                  {navItems.map((item, index) => (
                    <motion.li
                      key={item.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <button
                        onClick={() => handleNavClick(item.path)}
                        className="block py-2 text-lg font-medium text-foreground/80 hover:text-foreground w-full text-left"
                      >
                        {item.label}
                      </button>
                    </motion.li>
                  ))}
                </ul>
                <div className="flex flex-col gap-3 mt-6">
                  <Button 
                    className="w-full gradient-accent text-primary-foreground rounded-full"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      navigate("/book-consultation");
                    }}
                  >
                    Book Consultation
                  </Button>
                  <Button 
                    variant="outline"
                    className="w-full border-primary text-primary rounded-full"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      if (location.pathname === "/") {
                        document.getElementById("membership-inquiry")?.scrollIntoView({ behavior: "smooth" });
                      } else {
                        navigate("/");
                        setTimeout(() => {
                          document.getElementById("membership-inquiry")?.scrollIntoView({ behavior: "smooth" });
                        }, 100);
                      }
                    }}
                  >
                    Join Now
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
};

export default Header;
