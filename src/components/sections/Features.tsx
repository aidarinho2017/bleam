import { Bot, DollarSign, BarChart3, Zap } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Bot,
      title: 'Instant AI Responses',
      description: 'Answer customer questions instantly — even while you sleep. Our AI learns from your business to provide accurate, helpful responses 24/7',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: DollarSign,
      title: 'Smart Sales Automation',
      description: 'Increase sales with intelligent upselling bots that recommend products, handle objections, and close deals automatically',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Track conversations, monitor performance, and optimize your bots with detailed insights and conversion metrics',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: Zap,
      title: 'Easy Integration',
      description: 'Connect to Telegram and WhatsApp in minutes. No coding required — just drag, drop, and deploy your bot',
      gradient: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <section id="features" className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Why Choose <span className="text-gradient">Bleam?</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to create, deploy, and scale intelligent chatbots 
            that work around the clock
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