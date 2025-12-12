import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ProgramTimeline from "@/components/ProgramTimeline";
import FlyerSection from "@/components/FlyerSection";
import PracticalInfo from "@/components/PracticalInfo";
import InscriptionSection from "@/components/InscriptionSection";
import ShareSection from "@/components/ShareSection";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect } from "react";

const Index = () => {
  const { language } = useLanguage();

  useEffect(() => {
    // Update document title based on language
    document.title = language === 'fr' 
      ? 'Convention Internationale Diaspora 2026 | Paris 24-26 Juillet'
      : 'International Diaspora Convention 2026 | Paris July 24-26';
    
    // Update meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', language === 'fr'
        ? "Rejoignez la Convention Internationale Diaspora 2026 à Paris du 24 au 26 juillet. Un événement spirituel unique pour unir les cœurs du monde entier. Inscription gratuite."
        : "Join the International Diaspora Convention 2026 in Paris from July 24-26. A unique spiritual event to unite hearts from around the world. Free registration."
      );
    }
  }, [language]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <AboutSection />
      <ProgramTimeline />
      <FlyerSection />
      <PracticalInfo />
      <InscriptionSection />
      <ShareSection />
      <Footer />
    </div>
  );
};

export default Index;
