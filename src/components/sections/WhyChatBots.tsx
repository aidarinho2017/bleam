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

  return (
    <section className="py-12 md:py-20" aria-labelledby="why-chatbots-heading">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 id="why-chatbots-heading" className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Why Use <span className="text-gradient">ChatBots</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <article
                key={item.title}
                className="card-glass p-6 group hover:scale-105 transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="inline-flex p-3 rounded-xl bg-gradient-to-r from-primary to-accent mb-4">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-gradient transition-all">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChatBots;
