import { Zap, Settings, BookOpen, History, Calendar, Database } from 'lucide-react';

const WhyChatBots = () => {
  const items = [
    {
      icon: Zap,
      title: 'Instant replies = higher conversion',
      description: "Customers get answers immediately, so they don’t go to competitors.",
    },
    {
      icon: Settings,
      title: '2-click assistant setup',
      description: 'No tech skills needed — you’ll launch your bot in minutes.',
    },
    {
      icon: BookOpen,
      title: 'Train the bot on your data',
      description: 'Teach it to answer based on your products, policies, and tone.',
    },
    {
      icon: History,
      title: 'Bot remembers past conversations',
      description: 'Every client feels like a VIP because your bot recalls their history.',
    },
    {
      icon: Calendar,
      title: 'Schedules consultations & meetings',
      description: 'No more missed opportunities — your bot books them for you.',
    },
    {
      icon: Database,
      title: 'Adds data to CRM automatically',
      description: 'Every chat becomes a new lead or an updated client record.',
    },
  ];

  const colorVariants = [
    { stripe: 'bg-gradient-to-r from-[hsl(var(--chart-pink))] to-[hsl(var(--bleam-purple))]', iconBg: 'bg-gradient-to-r from-[hsl(var(--chart-pink))] to-[hsl(var(--bleam-purple))]', blob: 'from-[hsl(var(--chart-pink)/0.2)] to-[hsl(var(--bleam-purple)/0.2)]' },
    { stripe: 'bg-gradient-to-r from-[hsl(var(--chart-yellow))] to-[hsl(var(--chart-red))]', iconBg: 'bg-gradient-to-r from-[hsl(var(--chart-yellow))] to-[hsl(var(--chart-red))]', blob: 'from-[hsl(var(--chart-yellow)/0.2)] to-[hsl(var(--chart-red)/0.2)]' },
    { stripe: 'bg-gradient-to-r from-[hsl(var(--chart-green))] to-[hsl(var(--bleam-blue))]', iconBg: 'bg-gradient-to-r from-[hsl(var(--chart-green))] to-[hsl(var(--bleam-blue))]', blob: 'from-[hsl(var(--chart-green)/0.2)] to-[hsl(var(--bleam-blue)/0.2)]' },
    { stripe: 'bg-gradient-to-r from-[hsl(var(--bleam-purple))] to-[hsl(var(--chart-yellow))]', iconBg: 'bg-gradient-to-r from-[hsl(var(--bleam-purple))] to-[hsl(var(--chart-yellow))]', blob: 'from-[hsl(var(--bleam-purple)/0.2)] to-[hsl(var(--chart-yellow)/0.2)]' },
    { stripe: 'bg-gradient-to-r from-[hsl(var(--chart-red))] to-[hsl(var(--chart-pink))]', iconBg: 'bg-gradient-to-r from-[hsl(var(--chart-red))] to-[hsl(var(--chart-pink))]', blob: 'from-[hsl(var(--chart-red)/0.2)] to-[hsl(var(--chart-pink)/0.2)]' },
    { stripe: 'bg-gradient-to-r from-[hsl(var(--bleam-blue))] to-[hsl(var(--chart-green))]', iconBg: 'bg-gradient-to-r from-[hsl(var(--bleam-blue))] to-[hsl(var(--chart-green))]', blob: 'from-[hsl(var(--bleam-blue)/0.2)] to-[hsl(var(--chart-green)/0.2)]' },
  ];

  return (
    <section className="py-12 md:py-20" aria-labelledby="why-chatbots-heading">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 id="why-chatbots-heading" className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Why Use <span className="text-gradient">ChatBots</span>
          </h2>
        </div>

        {/* Colorful aligned grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, idx) => {
            const Icon = item.icon;
            const c = colorVariants[idx % colorVariants.length];
            return (
              <article
                key={item.title}
                className="relative group overflow-hidden rounded-2xl border border-border/60 bg-background/70 backdrop-blur-sm p-6 hover:shadow-[var(--shadow-glow)] hover-scale animate-slide-up"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                {/* Gradient top stripe */}
                <div className={`absolute inset-x-0 top-0 h-1.5 ${c.stripe}`} />

                <div className="flex items-start gap-4">
                  <div className={`inline-flex p-3 rounded-xl text-white ${c.iconBg}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1 group-hover:text-gradient transition-all">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>

                {/* Decorative gradient blob */}
                <div className={`pointer-events-none absolute -bottom-16 -right-16 w-40 h-40 rounded-full bg-gradient-to-br ${c.blob} blur-2xl`} />
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChatBots;
