import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const navItems = ["Services", "About Us", "Blogs", "Bookings"];
  return <>
      {/* Top Banner */}
      

      {/* Main Navigation */}
      <motion.header initial={{
      y: -100,
      opacity: 0
    }} animate={{
      y: 0,
      opacity: 1
    }} transition={{
      delay: 0.2,
      duration: 0.5
    }} className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-background/95 backdrop-blur-md shadow-soft" : "bg-transparent"}`}>
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            {/* Logo */}
            <motion.a href="#" className="flex items-center" whileHover={{
            scale: 1.02
          }}>
              <img src="https://i.imgur.com/9beP2dq.png" alt="SkinStation Logo" className="h-8 w-auto" />
            </motion.a>

            {/* Desktop Navigation */}
            <ul className="hidden md:flex items-center gap-8">
              {navItems.map(item => <li key={item}>
                  <motion.a href={`#${item.toLowerCase().replace(" ", "-")}`} className="text-foreground/80 hover:text-foreground font-medium transition-colors relative group" whileHover={{
                y: -2
              }}>
                    {item}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300" />
                  </motion.a>
                </li>)}
            </ul>

            <div className="hidden md:flex items-center gap-4">
              <Button variant="ghost" size="icon" className="text-foreground/70 hover:text-foreground">
                <Search className="h-5 w-5" />
              </Button>
              <Button className="gradient-accent text-accent-foreground hover:opacity-90 transition-opacity">
                Join Now
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </nav>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && <motion.div initial={{
          opacity: 0,
          height: 0
        }} animate={{
          opacity: 1,
          height: "auto"
        }} exit={{
          opacity: 0,
          height: 0
        }} className="md:hidden bg-background border-t border-border">
              <div className="container mx-auto px-4 py-6">
                <ul className="flex flex-col gap-4">
                  {navItems.map((item, index) => <motion.li key={item} initial={{
                opacity: 0,
                x: -20
              }} animate={{
                opacity: 1,
                x: 0
              }} transition={{
                delay: index * 0.1
              }}>
                      <a href={`#${item.toLowerCase().replace(" ", "-")}`} className="block py-2 text-lg font-medium text-foreground/80 hover:text-foreground" onClick={() => setIsMobileMenuOpen(false)}>
                        {item}
                  </a>
                </motion.li>)}
            </ul>
            <Button className="w-full mt-6 gradient-accent text-accent-foreground">
                  Join Now
                </Button>
              </div>
            </motion.div>}
        </AnimatePresence>
      </motion.header>
    </>;
};
export default Header;