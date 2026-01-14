import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle, Home, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { format } from "date-fns";
import html2canvas from "html2canvas";
import bookingStubBg from "@/assets/booking-stub.png";
interface BookingDetails {
  name: string;
  email: string;
  contactNumber: string;
  membership: string;
  date: string;
  time: string;
  message?: string;
  bookingNumber?: string;
}

// Generate a unique booking number
const generateBookingNumber = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `HLM-${timestamp.slice(-4)}${random}`;
};
const ThankYou = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingDetails = location.state as BookingDetails | null;
  const stubRef = useRef<HTMLDivElement>(null);
  const [showDownloadPrompt, setShowDownloadPrompt] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  // Generate booking number once and memoize it
  const bookingNumber = useMemo(() => {
    return bookingDetails?.bookingNumber || generateBookingNumber();
  }, [bookingDetails?.bookingNumber]);
  useEffect(() => {
    // If no booking details, redirect to home
    if (!bookingDetails) {
      navigate("/");
    }
  }, [bookingDetails, navigate]);
  const handleDownload = async () => {
    if (!stubRef.current) return;
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(stubRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null
      });
      const link = document.createElement("a");
      link.download = `hilome-booking-${bookingNumber}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      setShowDownloadPrompt(false);
    } catch (error) {
      console.error("Error downloading receipt:", error);
    } finally {
      setIsDownloading(false);
    }
  };
  if (!bookingDetails) {
    return null;
  }
  const formattedDate = bookingDetails.date ? format(new Date(bookingDetails.date), "MMMM d, yyyy") : "";
  const dayOfWeek = bookingDetails.date ? format(new Date(bookingDetails.date), "EEEE") : "";
  return <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center pt-20 pb-32">
        <div className="container mx-auto px-4">
          {/* Download Prompt Modal */}
          {showDownloadPrompt && <motion.div initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
              <motion.div initial={{
            scale: 0.9,
            opacity: 0
          }} animate={{
            scale: 1,
            opacity: 1
          }} className="bg-background rounded-xl p-5 max-w-xs w-full shadow-elevated text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-7 h-7 text-primary" />
                </div>
                <h2 className="font-display text-xl text-foreground mb-1">
                  Booking Confirmed!
                </h2>
                <p className="text-foreground/70 text-xs mb-4">
                  Download your receipt to show our staff when you arrive.
                </p>
                <div className="flex flex-col gap-2">
                  <Button onClick={handleDownload} disabled={isDownloading} size="sm" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center gap-2">
                    <Download className="w-4 h-4" />
                    {isDownloading ? "Downloading..." : "Download Receipt"}
                  </Button>
                  <Button onClick={() => setShowDownloadPrompt(false)} variant="ghost" size="sm" className="w-full text-foreground/60">
                    Maybe Later
                  </Button>
                </div>
              </motion.div>
            </motion.div>}

          <motion.div initial={{
          opacity: 0,
          y: 30
        }} animate={{
          opacity: 1,
          y: 0
        }} className="max-w-2xl mx-auto text-center">
            {/* Check Icon */}
            <motion.div 
              initial={{ scale: 0 }} 
              animate={{ scale: 1 }} 
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-8"
            >
              <CheckCircle className="w-10 h-10 text-primary" />
            </motion.div>
            
            {/* Welcome Message */}
            <motion.h1 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.3 }}
              className="font-display text-3xl md:text-4xl text-foreground mb-6"
            >
              Your Booking is Confirmed!
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.4 }}
              className="text-foreground/70 text-lg leading-relaxed mb-10 max-w-xl mx-auto"
            >
              Thank you for choosing Hilomè. We're excited to welcome you for your appointment. 
              Please arrive 10 minutes early to ensure a relaxing and seamless experience. 
              Our team is ready to guide you on your wellness journey.
            </motion.p>

            {/* Action Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Button 
                onClick={handleDownload} 
                disabled={isDownloading} 
                className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2 px-8"
              >
                <Download className="w-4 h-4" />
                {isDownloading ? "Downloading..." : "Download Receipt"}
              </Button>
              <Button 
                onClick={() => navigate("/")} 
                variant="outline" 
                className="flex items-center gap-2 px-8"
              >
                <Home className="w-4 h-4" />
                Back to Home
              </Button>
            </motion.div>
          </motion.div>

          {/* Hidden Receipt for Download */}
          <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
            <div 
              ref={stubRef}
              className="relative w-[400px] h-[600px]"
              style={{
                backgroundImage: `url(${bookingStubBg})`,
                backgroundSize: "cover",
                backgroundPosition: "center"
              }}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                <div className="bg-white/90 rounded-xl p-6 shadow-lg max-w-[320px] w-full">
                  <h2 className="font-display text-2xl text-[#5a5a3a] mb-1">HILOMÈ</h2>
                  <p className="text-[#5a5a3a]/60 text-xs mb-4">Wellness & Beauty</p>
                  
                  <div className="border-t border-dashed border-[#5a5a3a]/30 my-3"></div>
                  
                  <p className="text-[#5a5a3a] font-bold text-lg mb-1">Booking #{bookingNumber}</p>
                  
                  <div className="border-t border-dashed border-[#5a5a3a]/30 my-3"></div>
                  
                  <div className="space-y-2 text-[#5a5a3a] text-sm">
                    <div className="flex justify-between">
                      <span className="text-[#5a5a3a]/60">Name:</span>
                      <span className="font-medium">{bookingDetails.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#5a5a3a]/60">Date:</span>
                      <span className="font-medium">{formattedDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#5a5a3a]/60">Day:</span>
                      <span className="font-medium">{dayOfWeek}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#5a5a3a]/60">Time:</span>
                      <span className="font-medium">{bookingDetails.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#5a5a3a]/60">Service:</span>
                      <span className="font-medium">{bookingDetails.membership}</span>
                    </div>
                  </div>
                  
                  <div className="border-t border-dashed border-[#5a5a3a]/30 my-3"></div>
                  
                  <p className="text-[#5a5a3a]/60 text-xs">
                    Please arrive 10 minutes early.<br/>
                    Show this receipt upon arrival.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>;
};
export default ThankYou;