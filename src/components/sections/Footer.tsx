import { Bot, Twitter, Linkedin, Github } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  const footerLinks = {
    product: [
      { label: t('featuresFooter'), href: '#features' },
      { label: t('pricingFooter'), href: '#pricing' },
      { label: t('templates'), href: '#' },
      { label: t('integrations'), href: '#' }
    ],
    company: [
      { label: t('aboutUs'), href: '#' },
      { label: t('blog'), href: '#' },
      { label: t('careers'), href: '#' },
      { label: t('contactFooter'), href: '#' }
    ],
    legal: [
      { label: t('privacyPolicyFooter'), href: '#' },
      { label: t('termsOfServiceFooter'), href: '#' },
      { label: t('cookiePolicy'), href: '#' },
      { label: t('gdpr'), href: '#' }
    ],
    support: [
      { label: t('helpCenter'), href: '#' },
      { label: t('apiDocs'), href: '#' },
      { label: t('status'), href: '#' },
      { label: t('community'), href: '#' }
    ]
  };

  const socialLinks = [
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Github, href: '#', label: 'GitHub' }
  ];

  return (
    <footer className="bg-card/20 border-t border-border/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="p-2 rounded-lg bg-gradient-to-r from-primary to-accent">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient">Bleam</span>
            </Link>
            
            <p className="text-muted-foreground mb-6 max-w-sm">
              {t('footerDescription')}
            </p>
            
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    className="w-10 h-10 rounded-lg bg-card/50 border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all duration-300"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Links sections */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">{t('productSection')}</h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">{t('companySection')}</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">{t('legalSection')}</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">{t('supportSection')}</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-border/50 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            {t('allRightsReserved')}
          </p>
          
          <p className="text-muted-foreground text-sm mt-4 md:mt-0">
            {t('madeWithLove')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;