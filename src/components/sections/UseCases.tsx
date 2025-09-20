import { ShoppingCart, Headphones, UserCheck } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const UseCases = () => {
  const { t } = useLanguage();

  const useCases = [
    {
      icon: ShoppingCart,
      title: t('ecommerce'),
      description: t('ecommerceDesc'),
      features: [t('productRecommendations'), t('orderTracking'), t('paymentProcessing'), t('inventoryAlerts')],
      gradient: 'from-[hsl(var(--brand-orange))] to-[hsl(var(--brand-violet))]',
      dotColor: 'bg-[hsl(var(--brand-orange))]'
    },
    {
      icon: Headphones,
      title: t('customerSupport'),
      description: t('customerSupportDesc'),
      features: [t('availability247'), t('issueResolution'), t('ticketCreation'), t('knowledgeBase')],
      gradient: 'from-[hsl(var(--brand-blue))] to-[hsl(var(--brand-violet))]',
      dotColor: 'bg-[hsl(var(--brand-blue))]'
    },
    {
      icon: UserCheck,
      title: t('leadGeneration'),
      description: t('leadGenerationDesc'),
      features: [t('leadScoring'), t('appointmentBooking'), t('followUpCampaigns'), t('crmIntegration')],
      gradient: 'from-[hsl(var(--brand-green))] to-[hsl(var(--brand-blue))]',
      dotColor: 'bg-[hsl(var(--brand-green))]'
    }
  ];

  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            {t('useCasesTitle')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('useCasesSubtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {useCases.map((useCase, index) => {
            const Icon = useCase.icon;
            return (
              <div 
                key={useCase.title}
                className="card-glass p-8 group hover:scale-105 transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${useCase.gradient} mb-6 group-hover:shadow-lg transition-all duration-300`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                
                <h3 className="text-xl font-semibold mb-4 group-hover:text-gradient transition-all duration-300">
                  {useCase.title}
                </h3>
                
                <p className="text-muted-foreground mb-6">
                  {useCase.description}
                </p>
                
                <ul className="space-y-2">
                  {useCase.features.map((feature) => (
                    <li key={feature} className="flex items-center text-sm text-muted-foreground">
                      <div className={`w-1.5 h-1.5 ${useCase.dotColor} rounded-full mr-3`} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default UseCases;