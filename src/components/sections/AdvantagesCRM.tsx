import { BarChart3, HeartHandshake, Layers } from 'lucide-react';

const AdvantagesCRM = () => {
  const items = [
    {
      icon: BarChart3,
      title: 'Full sales & goods analytics',
      description: 'Track your stock, money flow, and sales in real-time.',
    },
    {
      icon: HeartHandshake,
      title: 'Better customer relationships',
      description: 'Run promotions, give bonuses, and build loyalty programs.',
    },
    {
      icon: Layers,
      title: 'Ready-made templates or custom solutions',
      description: 'Start fast with pre-made templates or get one tailored for your business.',
    },
  ];

  return (
    <section className="py-12 md:py-20 bg-card/20" aria-labelledby="advantages-crm-heading">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 id="advantages-crm-heading" className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Advantages — <span className="text-gradient">CRM</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {items.map((item, idx) => {
            const Icon = item.icon;
            const gradients = [
              'from-[hsl(var(--brand-blue))] to-[hsl(var(--brand-violet))]',
              'from-[hsl(var(--brand-green))] to-[hsl(var(--brand-blue))]',
              'from-[hsl(var(--brand-orange))] to-[hsl(var(--brand-violet))]'
            ];
            return (
              <article
                key={item.title}
                className="card-glass p-8 group hover:scale-105 transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${gradients[idx % gradients.length]} mb-6`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-gradient transition-all">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AdvantagesCRM;
