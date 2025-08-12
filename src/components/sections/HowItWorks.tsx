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
        {/* ChatBot Flow - colorful card steps */}
        <div className="relative overflow-hidden rounded-3xl border border-border/50 p-8 mb-20 bg-gradient-to-br from-primary/5 to-accent/5">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              How it Works — <span className="text-gradient">ChatBot</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Launch your assistant in three simple steps.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connection line */}
            <div className="hidden md:block absolute top-20 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-primary to-accent opacity-30" />
            {[
              { icon: UserPlus, title: 'Create your account', description: 'Sign up in minutes', step: '01' },
              { icon: Settings, title: 'Customize your bot in a simple interface', description: 'No tech skills needed', step: '02' },
              { icon: Rocket, title: 'Launch — and let it work for you 24/7', description: 'Go live on Telegram & WhatsApp', step: '03' }
            ].map((s, index) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.title}
                  className="relative text-center group animate-slide-up"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  {/* Number badge */}
                  <div className="mx-auto mb-6 w-10 h-10 rounded-full bg-gradient-to-r from-primary to-accent text-white flex items-center justify-center font-semibold shadow-[var(--shadow-glow)]">
                    {s.step}
                  </div>
                  {/* Icon card */}
                  <div className="inline-flex p-6 rounded-2xl bg-background/70 backdrop-blur-sm border border-border/50 group-hover:shadow-[var(--shadow-glow)] group-hover:scale-105 transition-all duration-300">
                    <Icon className="w-8 h-8 text-primary group-hover:text-accent transition-colors duration-300" />
                  </div>
                  <h3 className="text-xl font-semibold mt-4 mb-2 group-hover:text-gradient transition-all duration-300">
                    {s.title}
                  </h3>
                  <p className="text-muted-foreground">{s.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* CRM Flow - vertical timeline style (different from ChatBot) */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            How it Works — <span className="text-gradient">CRM</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Build relationships and make smarter decisions.
          </p>
        </div>

        <div className="relative max-w-3xl mx-auto">
          {/* Timeline rail */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary to-accent opacity-40" />

          {[
            { icon: UserPlus, title: 'Choose a template or request a custom one', description: 'Get started fast', step: '01' },
            { icon: Settings, title: 'Build customer relationships and analyze sales data', description: 'Everything in one place', step: '02' },
            { icon: Rocket, title: 'Earn more with better decisions and repeat clients', description: 'Grow revenue sustainably', step: '03' }
          ].map((s, index) => {
            const Icon = s.icon;
            return (
              <div
                key={s.title}
                className="relative pl-16 py-6 animate-slide-up"
                style={{ animationDelay: `${index * 0.25}s` }}
              >
                {/* Timeline node */}
                <div className="absolute left-0 top-4 w-12 h-12 rounded-full bg-gradient-to-r from-primary to-accent text-white flex items-center justify-center font-bold shadow-[var(--shadow-glow)]">
                  {s.step}
                </div>

                <div className="card-glass p-6 border border-border/60 bg-background/70 backdrop-blur-sm">
                  <div className="flex items-start gap-4">
                    <div className="inline-flex p-3 rounded-xl bg-gradient-to-r from-primary to-accent">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">{s.title}</h3>
                      <p className="text-muted-foreground">{s.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;