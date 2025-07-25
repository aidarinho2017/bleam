import Navigation from '@/components/ui/navigation';
import Hero from '@/components/sections/Hero';
import SocialProof from '@/components/sections/SocialProof';
import Features from '@/components/sections/Features';
import HowItWorks from '@/components/sections/HowItWorks';
import UseCases from '@/components/sections/UseCases';
import Testimonials from '@/components/sections/Testimonials';
import Pricing from '@/components/sections/Pricing';
import FAQ from '@/components/sections/FAQ';
import FinalCTA from '@/components/sections/FinalCTA';
import Footer from '@/components/sections/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <Hero />
        <SocialProof />
        <Features />
        <HowItWorks />
        <UseCases />
        <Testimonials />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
