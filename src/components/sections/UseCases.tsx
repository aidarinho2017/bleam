import { ShoppingCart, Headphones, UserCheck } from 'lucide-react';

const UseCases = () => {
  const useCases = [
    {
      icon: ShoppingCart,
      title: 'E-commerce',
      description: 'From clothing stores to gadget shops',
      features: ['Product recommendations', 'Order tracking', 'Payment processing', 'Inventory alerts'],
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Headphones,
      title: 'Customer Support',
      description: 'Reduce wait times and increase satisfaction',
      features: ['24/7 availability', 'Issue resolution', 'Ticket creation', 'Knowledge base'],
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: UserCheck,
      title: 'Lead Generation',
      description: 'Capture more potential buyers automatically',
      features: ['Lead scoring', 'Appointment booking', 'Follow-up campaigns', 'CRM integration'],
      gradient: 'from-green-500 to-emerald-500'
    }
  ];

  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Perfect for <span className="text-gradient">Every Business</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Whether you're selling products, providing support, or generating leads, 
            Bleam adapts to your business needs
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {useCases.map((useCase, index) => {
            const Icon = useCase.icon;
            return (
              <div 
                key={useCase.title}
                className="card-glass p-8 group hover:scale-105 transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${useCase.gradient} mb-6 group-hover:shadow-lg transition-all duration-300`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                
                <h3 className="text-xl font-semibold mb-4 group-hover:text-gradient transition-all duration-300">
                  {useCase.title}
                </h3>
                
                <p className="text-muted-foreground mb-6">
                  {useCase.description}
                </p>
                
                <ul className="space-y-2">
                  {useCase.features.map((feature) => (
                    <li key={feature} className="flex items-center text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default UseCases;