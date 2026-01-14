import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const BookConsultation = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contactNumber: "",
    preferredBranch: "",
    date: "",
    time: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const branches = [
    "Main Branch - Manila",
    "Makati Branch",
    "Quezon City Branch",
    "BGC Branch",
    "Ortigas Branch",
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (
      formData.name &&
      formData.email &&
      formData.contactNumber &&
      formData.preferredBranch &&
      formData.date &&
      formData.time
    ) {
      console.log("Form submitted:", formData);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          name: "",
          email: "",
          contactNumber: "",
          preferredBranch: "",
          date: "",
          time: "",
          message: "",
        });
      }, 3000);
    } else {
      alert("Please fill in all required fields");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-foreground/70 hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </motion.button>

          {/* Page Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center mb-6"
          >
            <h1 className="font-display text-3xl md:text-4xl text-foreground mb-2">
              Book Your Consultation
            </h1>
            <p className="text-foreground/70 text-base max-w-2xl mx-auto">
              Schedule a free consultation with our skincare specialists.
            </p>
          </motion.div>

          {/* Form Container */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-xl mx-auto"
          >
            <div className="bg-primary rounded-2xl p-5 md:p-6 shadow-elevated">
              <div className="space-y-4">
                {/* Name Field */}
                <div>
                  <label className="block text-primary-foreground font-semibold text-sm mb-1">
                    Name <span className="text-red-300">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b-2 border-primary-foreground/50 text-primary-foreground placeholder-primary-foreground/50 py-2 px-0 focus:outline-none focus:border-accent transition-colors text-sm"
                  />
                </div>

                {/* Email and Contact Number Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-primary-foreground font-semibold text-sm mb-1">
                      Email <span className="text-red-300">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-transparent border-b-2 border-primary-foreground/50 text-primary-foreground placeholder-primary-foreground/50 py-2 px-0 focus:outline-none focus:border-accent transition-colors text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-primary-foreground font-semibold text-sm mb-1">
                      Contact Number <span className="text-red-300">*</span>
                    </label>
                    <div className="flex items-center border-b-2 border-primary-foreground/50 focus-within:border-accent transition-colors">
                      <span className="mr-2 text-xl">🇵🇭</span>
                      <input
                        type="tel"
                        name="contactNumber"
                        placeholder="09XX XXX XXXX"
                        value={formData.contactNumber}
                        onChange={handleChange}
                        className="flex-1 bg-transparent text-primary-foreground placeholder-primary-foreground/50 py-2 px-0 focus:outline-none text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Preferred Branch */}
                <div>
                  <label className="block text-primary-foreground font-semibold text-sm mb-1">
                    Preferred Branch <span className="text-red-300">*</span>
                  </label>
                  <select
                    name="preferredBranch"
                    value={formData.preferredBranch}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b-2 border-primary-foreground/50 text-primary-foreground py-2 px-0 focus:outline-none focus:border-accent transition-colors cursor-pointer text-sm"
                    style={{
                      color: formData.preferredBranch
                        ? "hsl(var(--primary-foreground))"
                        : "hsl(var(--primary-foreground) / 0.5)",
                    }}
                  >
                    <option value="" className="bg-primary text-primary-foreground">
                      Select a branch
                    </option>
                    {branches.map((branch, index) => (
                      <option
                        key={index}
                        value={branch}
                        className="bg-primary text-primary-foreground"
                      >
                        {branch}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Preferred Schedule */}
                <div>
                  <label className="block text-primary-foreground font-semibold text-sm mb-1">
                    Preferred Schedule <span className="text-red-300">*</span>
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full bg-transparent border-b-2 border-primary-foreground/50 text-primary-foreground py-2 px-0 focus:outline-none focus:border-accent transition-colors text-sm"
                    />
                    <input
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      className="w-full bg-transparent border-b-2 border-primary-foreground/50 text-primary-foreground py-2 px-0 focus:outline-none focus:border-accent transition-colors text-sm"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-primary-foreground font-semibold text-sm mb-1">
                    Message
                  </label>
                  <textarea
                    name="message"
                    placeholder="Tell us about your skincare concerns..."
                    value={formData.message}
                    onChange={handleChange}
                    rows={2}
                    className="w-full bg-transparent border-b-2 border-primary-foreground/50 text-primary-foreground placeholder-primary-foreground/50 py-2 px-0 focus:outline-none focus:border-accent transition-colors resize-none text-sm"
                  />
                </div>

                {/* Submit Button */}
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={handleSubmit}
                    className="w-full bg-accent text-accent-foreground font-bold py-4 rounded-full hover:bg-accent/90 transition-colors"
                    size="lg"
                  >
                    {submitted ? (
                      <span className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        Consultation Booked!
                      </span>
                    ) : (
                      "Book your FREE consultation now!"
                    )}
                  </Button>
                </motion.div>
              </div>

              {submitted && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 text-center text-primary-foreground"
                >
                  <p className="text-base">Thank you! We'll contact you soon.</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BookConsultation;
