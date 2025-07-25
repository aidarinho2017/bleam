import { Button } from '@/components/ui/button';
import { Check, Zap, Crown, Building } from 'lucide-react';
import { Link } from 'react-router-dom';

const Pricing = () => {
  const plans = [
    {
      name: 'Starter',
      price: 'Free',
      description: 'Perfect for trying out Bleam',
      features: [
        '100 messages/month',
        '1 bot',
        'Basic templates',
        'Email support',
        'Community access'
      ],
      icon: Zap,
      popular: false,
      cta: 'Start Free'
    },
    {
      name: 'Pro',
      price: '$29',
      period: '/month',
      description: 'Best for growing businesses',
      features: [
        '10,000 messages/month',
        'Unlimited bots',
        'Custom templates',
        'Priority support',
        'Advanced analytics',
        'WhatsApp & Telegram',
        'API access'
      ],
      icon: Crown,
      popular: true,
      cta: 'Start Pro Trial'
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For large organizations',
      features: [
        'Unlimited messages',
        'Unlimited bots',
        'Custom integrations',
        'Dedicated support',
        'SLA guarantee',
        'On-premise option',
        'Training & onboarding'
      ],
      icon: Building,
      popular: false,
      cta: 'Contact Sales'
    }
  ];

  return (
    <section id="pricing" className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Simple, <span className="text-gradient">Transparent Pricing</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect plan for your business. Start free and upgrade as you grow.
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
                      Most Popular
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
                    {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                  </div>
                </div>
                
                {/* Features */}
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center text-sm">
                      <Check className="w-4 h-4 text-primary mr-3 flex-shrink-0" />
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                {/* CTA */}
                <Link to="/register" className="block">
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
            All plans include free SSL, 99.9% uptime SLA, and no setup fees
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;