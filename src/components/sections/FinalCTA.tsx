import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, CreditCard, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const FinalCTA = () => {
  const { t } = useLanguage();

  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="relative">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-3xl" />
          <div className="absolute inset-0 bg-gradient-radial rounded-3xl" />
          
          <div className="relative card-glass p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              {t('finalCtaTitle')}
            </h2>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t('finalCtaSubtitle')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link to="/login">
                <Button className="btn-primary text-lg px-8 py-4 glow-effect">
                  {t('startUsing')}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center mr-2">
                  <Shield className="w-4 h-4 text-green-400" />
                </div>
                {t('freeTrial')}
              </div>
              
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center mr-2">
                  <CreditCard className="w-4 h-4 text-blue-400" />
                </div>
                {t('noCreditCard')}
              </div>
              
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center mr-2">
                  <X className="w-4 h-4 text-red-400" />
                </div>
                {t('cancelAnytime')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;