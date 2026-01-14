import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle, ArrowLeft, Home, Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { format } from "date-fns";
import html2canvas from "html2canvas";

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
        backgroundColor: null,
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

  const formattedDate = bookingDetails.date 
    ? format(new Date(bookingDetails.date), "MMMM d, yyyy")
    : "";

  const dayOfWeek = bookingDetails.date
    ? format(new Date(bookingDetails.date), "EEEE")
    : "";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          {/* Download Prompt Modal */}
          {showDownloadPrompt && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-background rounded-2xl p-6 max-w-sm w-full shadow-elevated text-center"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 text-primary" />
                </div>
                <h2 className="font-display text-2xl text-foreground mb-2">
                  Booking Confirmed!
                </h2>
                <p className="text-foreground/70 text-sm mb-6">
                  Would you like to download your booking receipt? You can show this to our staff when you arrive.
                </p>
                <div className="flex flex-col gap-3">
                  <Button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    {isDownloading ? "Downloading..." : "Download Receipt"}
                  </Button>
                  <Button
                    onClick={() => setShowDownloadPrompt(false)}
                    variant="ghost"
                    className="w-full text-foreground/60"
                  >
                    Maybe Later
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-lg mx-auto"
          >
            {/* Success Message */}
            <div className="text-center mb-8">
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="font-display text-3xl md:text-4xl text-foreground mb-2"
              >
                Your Booking Receipt
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-foreground/70"
              >
                Show this receipt to our staff when you arrive
              </motion.p>
            </div>

            {/* Booking Stub - Paper Style with Background Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="relative mx-auto mb-6"
              style={{ maxWidth: "380px" }}
            >
              <div 
                ref={stubRef}
                className="relative rounded-lg overflow-hidden shadow-elevated"
                style={{
                  backgroundImage: `url(https://i.imgur.com/7En3vdq.png)`,
                  backgroundSize: "100% 100%",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  aspectRatio: "auto",
                  minHeight: "500px",
                }}
              >
                {/* Semi-transparent overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
                
                {/* Content */}
                <div className="relative h-full flex flex-col items-center justify-center p-6 text-center" style={{ paddingTop: "120px" }}>
                  {/* Booking Details - positioned at bottom half */}
                  <div className="flex flex-col items-center w-full">
                    {/* Booking Number */}
                    <div className="mb-3 bg-white/80 backdrop-blur-sm rounded-lg px-5 py-2">
                      <p className="text-primary/70 text-[9px] tracking-widest uppercase mb-0.5 font-medium">
                        Booking Number
                      </p>
                      <p className="font-display text-xl text-primary font-bold tracking-wide">
                        {bookingNumber}
                      </p>
                    </div>

                    {/* Guest Name */}
                    <div className="mb-2">
                      <p className="text-primary/60 text-[9px] tracking-widest uppercase mb-0.5">
                        Guest Name
                      </p>
                      <p className="font-display text-lg text-primary font-semibold">
                        {bookingDetails.name}
                      </p>
                    </div>

                    {/* Date & Time */}
                    <div className="mb-2 bg-white/60 backdrop-blur-sm rounded-lg px-4 py-2">
                      <p className="text-primary/60 text-[9px] tracking-widest uppercase mb-0.5">
                        Appointment Schedule
                      </p>
                      <p className="text-primary font-semibold text-xs">
                        {dayOfWeek}
                      </p>
                      <p className="text-primary text-base font-bold">
                        {formattedDate}
                      </p>
                      <p className="text-primary/80 font-medium text-sm">
                        {bookingDetails.time}
                      </p>
                    </div>

                    {/* Membership Badge */}
                    <div className="mb-2">
                      <span className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-[10px] font-medium tracking-wide">
                        {bookingDetails.membership}
                      </span>
                    </div>

                    {/* Footer */}
                    <div className="mt-1">
                      <p className="text-primary/50 text-[8px] tracking-wide">
                        Please arrive 10 minutes before your appointment
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Download Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-center mb-6"
            >
              <Button
                onClick={handleDownload}
                disabled={isDownloading}
                className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2 mx-auto"
              >
                <Download className="w-4 h-4" />
                {isDownloading ? "Downloading..." : "Download Receipt"}
              </Button>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-3 justify-center"
            >
              <Button
                onClick={() => navigate("/book-consultation")}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Book Another
              </Button>
              <Button
                onClick={() => navigate("/")}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                Back to Home
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ThankYou;
