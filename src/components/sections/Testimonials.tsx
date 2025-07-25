import { Star } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      company: 'TechStart Inc.',
      avatar: '👩‍💼',
      rating: 5,
      text: 'Bleam increased our response rate by 300% and we\'re closing more deals than ever. The AI is incredibly smart and learns fast.'
    },
    {
      name: 'Mike Chen',
      company: 'E-Shop Plus',
      avatar: '👨‍💻',
      rating: 5,
      text: 'Setup took 5 minutes and we started seeing results immediately. Our customers love the instant responses.'
    },
    {
      name: 'Emma Davis',
      company: 'Growth Agency',
      avatar: '👩‍🚀',
      rating: 5,
      text: 'The analytics help us understand our customers better than any other tool. ROI was positive within the first week.'
    }
  ];

  return (
    <section className="py-12 md:py-20 bg-card/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            What Our <span className="text-gradient">Customers Say</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of businesses that have transformed their customer communication
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={testimonial.name}
              className="card-glass p-8 group hover:scale-105 transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Rating */}
              <div className="flex items-center mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              
              {/* Testimonial text */}
              <blockquote className="text-foreground mb-6 leading-relaxed">
                "{testimonial.text}"
              </blockquote>
              
              {/* Author */}
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-xl mr-4">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-foreground">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;