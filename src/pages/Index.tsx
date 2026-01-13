import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturedServices from "@/components/FeaturedServices";
import ServicesGrid from "@/components/ServicesGrid";
import OurStory from "@/components/OurStory";
import MembershipPlans from "@/components/MembershipPlans";
import Testimonials from "@/components/Testimonials";
import SocialFeed from "@/components/SocialFeed";
import Footer from "@/components/Footer";
import FloatingBookButton from "@/components/FloatingBookButton";

const Index = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Header />
      <main>
        <Hero />
        <FeaturedServices />
        <ServicesGrid />
        <OurStory />
        <MembershipPlans />
        <Testimonials />
        <SocialFeed />
      </main>
      <Footer />
      <FloatingBookButton />
    </div>
  );
};

export default Index;
