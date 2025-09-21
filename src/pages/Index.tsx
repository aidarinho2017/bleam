import Navigation from '@/components/ui/navigation';
import Seo from '@/components/seo/Seo';
import Hero from '@/components/sections/Hero';
import WhyChatBots from '@/components/sections/WhyChatBots';
import Features from '@/components/sections/Features';
import AdvantagesCRM from '@/components/sections/AdvantagesCRM';
import HowItWorks from '@/components/sections/HowItWorks';
import UseCases from '@/components/sections/UseCases';
import Pricing from '@/components/sections/Pricing';
import FAQ from '@/components/sections/FAQ';
import FinalCTA from '@/components/sections/FinalCTA';
import Footer from '@/components/sections/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <Seo 
          title="CRM + AI ChatBots — Sales automation 24/7"
          description="Instant customer communication, higher conversions, and stronger loyalty — all in one simple tool."
          canonical={window.location.href}
        />
        <Hero />
        <AdvantagesCRM />
          <Features />
        <HowItWorks />
        <UseCases />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
