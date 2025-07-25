import { UserPlus, Settings, Rocket } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: UserPlus,
      title: 'Create Account',
      description: 'Sign up and choose your bot template',
      step: '01'
    },
    {
      icon: Settings,
      title: 'Customize Bot',
      description: 'Train your AI with your business knowledge',
      step: '02'
    },
    {
      icon: Rocket,
      title: 'Deploy & Scale',
      description: 'Launch on Telegram & WhatsApp instantly',
      step: '03'
    }
  ];

  return (
    <section className="py-12 md:py-20 bg-card/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Get Started in <span className="text-gradient">3 Simple Steps</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From zero to hero in minutes. No technical expertise required.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connection lines for desktop */}
          <div className="hidden md:block absolute top-24 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-primary to-accent opacity-30" />
          
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div 
                key={step.title}
                className="text-center group animate-slide-up"
                style={{ animationDelay: `${index * 0.3}s` }}
              >
                <div className="relative mb-8">
                  {/* Step number */}
                  <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center text-sm font-bold text-white z-10">
                    {step.step}
                  </div>
                  
                  {/* Icon container */}
                  <div className="inline-flex p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 group-hover:shadow-[var(--shadow-glow)] group-hover:scale-110 transition-all duration-500">
                    <Icon className="w-8 h-8 text-primary group-hover:text-accent transition-colors duration-300" />
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold mb-4 group-hover:text-gradient transition-all duration-300">
                  {step.title}
                </h3>
                
                <p className="text-muted-foreground">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;