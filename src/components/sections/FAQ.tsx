import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: 'How long does setup take?',
      answer: 'Most users have their first bot running within 5 minutes. Our intuitive interface guides you through each step, and pre-built templates make it even faster.'
    },
    {
      question: 'Do I need coding experience?',
      answer: 'Not at all! Bleam is designed for everyone. Our drag-and-drop interface and pre-built templates mean you can create sophisticated bots without writing a single line of code.'
    },
    {
      question: 'Which platforms do you support?',
      answer: 'Currently we support Telegram and WhatsApp, with more platforms coming soon including Discord, Facebook Messenger, and custom web chat widgets.'
    },
    {
      question: 'Is my data secure?',
      answer: 'Absolutely. We use enterprise-grade encryption, comply with GDPR and CCPA, and never share your data with third parties. Your conversations and customer data are completely private.'
    },
    {
      question: 'Can I customize the bot\'s responses?',
      answer: 'Yes! You can fully customize your bot\'s personality, responses, and behavior. Train it with your specific business knowledge and adjust its tone to match your brand.'
    }
  ];

  return (
    <section className="py-12 md:py-20 bg-card/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Frequently Asked <span className="text-gradient">Questions</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about Bleam. Can't find what you're looking for? 
            Feel free to contact our support team.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="card-glass mb-4 overflow-hidden animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                className="w-full px-6 py-6 text-left flex items-center justify-between hover:bg-card/30 transition-colors duration-200"
              >
                <span className="font-semibold text-foreground pr-4">
                  {faq.question}
                </span>
                <ChevronDown 
                  className={`w-5 h-5 text-muted-foreground transition-transform duration-300 flex-shrink-0 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-6 pb-6">
                  <p className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;