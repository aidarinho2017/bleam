import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(0);
    const { t } = useLanguage();

    const faqs = [
        {
            question: t('faqQuestion1'),
            answer: t('faqAnswer1')
        },
        {
            question: t('faqQuestion2'),
            answer: t('faqAnswer2')
        },
        {
            question: t('faqQuestion3'),
            answer: t('faqAnswer3')
        },
        {
            question: t('faqQuestion4'),
            answer: t('faqAnswer4')
        }
    ];

    return (
        <section className="py-12 md:py-20 bg-card/20">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                        {t('faqTitle')}
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        {t('faqSubtitle')}
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