const SocialProof = () => {
  const companies = [
    'TechCorp', 'InnovateAI', 'FutureBot', 'ChatFlow', 'AutoMate', 'BotBuilder'
  ];

  const stats = [
    { number: '50M+', label: 'Messages Processed' },
    { number: '99.9%', label: 'Uptime' },
    { number: '24/7', label: 'Support' },
    { number: '5-min', label: 'Setup' },
  ];

  return (
    <section className="py-12 md:py-20 border-b border-border/50">
      <div className="container mx-auto px-4">
        {/* Trusted By */}
        <div className="text-center mb-12">
          <p className="text-sm text-muted-foreground mb-8">Trusted by industry leaders</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
            {companies.map((company, index) => (
              <div 
                key={company} 
                className="text-muted-foreground font-medium hover:text-foreground transition-colors duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {company}
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={stat.label} 
              className="text-center animate-slide-up"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">
                {stat.number}
              </div>
              <div className="text-sm text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProof;