import { UserPlus, Settings, Rocket } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const HowItWorks = () => {
  const { t } = useLanguage();
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

  const stepColors = [
    { grad: 'from-[hsl(var(--brand-green))] to-[hsl(var(--brand-blue))]', soft: 'bg-[hsl(var(--brand-green)/0.12)]' },
    { grad: 'from-[hsl(var(--brand-orange))] to-[hsl(var(--brand-violet))]', soft: 'bg-[hsl(var(--brand-orange)/0.12)]' },
    { grad: 'from-[hsl(var(--brand-blue))] to-[hsl(var(--brand-violet))]', soft: 'bg-[hsl(var(--brand-blue)/0.12)]' },
  ];

  const crmColors = [
    { grad: 'from-[hsl(var(--brand-blue))] to-[hsl(var(--brand-violet))]' },
    { grad: 'from-[hsl(var(--brand-green))] to-[hsl(var(--brand-blue))]' },
    { grad: 'from-[hsl(var(--brand-orange))] to-[hsl(var(--brand-violet))]' },
  ];

  return (
    <div>
        {/* CRM Flow - vertical timeline style (different from ChatBot) */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            {t('howItWorksTitle')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('howItWorksSubtitle')}
          </p>
        </div>

        <div className="relative max-w-3xl mx-auto">
          {/* Timeline rail */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary to-accent opacity-40" />

          {[
            { icon: UserPlus, title: t('step1Title'), description: t('step1Description'), step: '01' },
            { icon: Settings, title: t('step2Title'), description: t('step2Description'), step: '02' },
            { icon: Rocket, title: t('step3Title'), description: t('step3Description'), step: '03' }
          ].map((s, index) => {
            const Icon = s.icon;
            return (
              <div
                key={s.title}
                className="relative pl-16 py-6 animate-slide-up"
                style={{ animationDelay: `${index * 0.25}s` }}
              >
                {/* Timeline node */}
                <div className={`absolute left-0 top-4 w-12 h-12 rounded-full bg-gradient-to-r ${crmColors[index % crmColors.length].grad} text-white flex items-center justify-center font-bold shadow-[var(--shadow-glow)]`}>
                  {s.step}
                </div>

                <div className="card-glass p-6 border border-border/60 bg-background/70 backdrop-blur-sm">
                  <div className="flex items-start gap-4">
                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${crmColors[index % crmColors.length].grad}`}>
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
  );
};

export default HowItWorks;