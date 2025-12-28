import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import PricingSection from "@/components/PricingSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>NexusAI - Build Apps with AI | Create Next.js Apps Through Conversation</title>
        <meta 
          name="description" 
          content="Transform your ideas into fully functional Next.js applications. Simply chat with our AI and watch your vision come to life. Start building for free today." 
        />
        <meta name="keywords" content="AI app builder, Next.js, React, no-code, low-code, web development, AI development" />
        <link rel="canonical" href="https://nexusai.dev" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
          <HeroSection />
          <FeaturesSection />
          <HowItWorksSection />
          <TestimonialsSection />
          <PricingSection />
          <CTASection />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
