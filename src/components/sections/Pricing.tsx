import { Button } from '@/components/ui/button';
import { Check, Zap, Crown, Building } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const Pricing = () => {
  const { t } = useLanguage();

  const plans = [
    {
      name: t('freeTrialPlan'),
      price: 'Free',
      description: t('freeTrialDesc'),
      features: [
        t('quickStart'),
        t('sampleTemplates'),
        t('cancelAnytimePricing')
      ],
      icon: Zap,
      popular: false,
      cta: t('startPricing'),
      link: '/login'
    },
    {
      name: t('botPlan'),
      price: 'from 10,000 тг',
      description: t('botPlanDesc'),
      features: [
        t('aiResponses247'),
        t('connectData'),
        t('bookingsLeads'),
        t('basicAnalytics')
      ],
      icon: Crown,
      popular: true,
      cta: t('leaveRequest'),
      link: '/contacts'
    },
    {
      name: t('botCrmPlan'),
      price: 'from 30,000 тг',
      description: t('botCrmDesc'),
      features: [
        t('salesInventory'),
        t('loyaltyPrograms'),
        t('templatesCustom'),
        t('prioritySupport')
      ],
      icon: Building,
      popular: false,
      cta: t('leaveRequest'),
      link: '/contacts'
    }
  ];

  return (
    <section id="pricing" className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            {t('pricingTitle')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('pricingSubtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <div 
                key={plan.name}
                className={`card-glass p-8 relative group hover:scale-105 transition-all duration-300 animate-slide-up ${
                  plan.popular ? 'ring-2 ring-primary' : ''
                }`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-primary to-accent text-white px-4 py-1 rounded-full text-sm font-medium">
                    {t('mostPopular')}
                  </div>
                  </div>
                )}
                
                {/* Plan header */}
                <div className="text-center mb-8">
                  <div className="inline-flex p-3 rounded-xl bg-gradient-to-r from-primary to-accent mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{plan.description}</p>
                  
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gradient">{plan.price}</span>
                  </div>
                </div>
                
                {/* Features */}
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center text-sm">
                      <Check className="w-4 h-4 text-[hsl(var(--brand-green))] mr-3 flex-shrink-0" />
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                {/* CTA */}
                <Link to={plan.link} className="block">
                  <Button 
                    className={`w-full ${
                      plan.popular ? 'btn-primary' : 'btn-secondary'
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>

        {/* Additional info */}
        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground">
            {t('planFooter')}
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;