import { Bot, DollarSign, BarChart3, Zap } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Features = () => {
  const { t } = useLanguage();
  
  const features = [
    {
      icon: Bot,
      title: t('instantAiResponses'),
      description: t('instantAiDesc'),
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: DollarSign,
      title: t('smartSalesAutomation'),
      description: t('smartSalesDesc'),
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: BarChart3,
      title: t('advancedAnalytics'),
      description: t('advancedAnalyticsDesc'),
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: Zap,
      title: t('easyIntegration'),
      description: t('easyIntegrationDesc'),
      gradient: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <section id="features" className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            {t('whyChoose')} <span className="text-gradient">{t('company')}?</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('whyChooseSubtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={feature.title}
                className="card-glass p-8 group hover:scale-105 transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.gradient} mb-6 group-hover:shadow-lg transition-all duration-300`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                
                <h3 className="text-xl font-semibold mb-4 group-hover:text-gradient transition-all duration-300">
                  {feature.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;