import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Bot, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSelector from '@/components/ui/language-selector';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { t } = useLanguage();

  const navItems = [
    { href: '#features', label: t('features')},
    { href: '#pricing', label: t('pricing')},
    { href: '#about', label: t('about')},
  ];

  const isHomePage = location.pathname === '/';

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="p-2 rounded-lg bg-gradient-to-r from-primary to-accent group-hover:shadow-[var(--shadow-glow)] transition-all duration-300">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient">{t('company')}</span>
          </Link>

          {/* Desktop Navigation */}
          {isHomePage && (
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="btn-ghost transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </div>
          )}

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <LanguageSelector />
            <ThemeToggle />
            <Link to="/login">
              <Button variant="ghost" className="btn-ghost">
                {t('login')}
              </Button>
            </Link>
            <Link to="/register">
              <Button className="btn-primary">
                {t('getStarted')}
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-foreground hover:bg-card/50 transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 bg-card/95 backdrop-blur-lg rounded-b-2xl border border-border/50 mt-2">
            {isHomePage && (
              <div className="flex flex-col space-y-4 px-4 mb-4">
                {navItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="text-foreground/80 hover:text-foreground transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            )}
            <div className="flex flex-col space-y-2 px-4 pt-4 border-t border-border/50">
              <div className="flex justify-center gap-2 mb-2">
                <LanguageSelector />
                <ThemeToggle />
              </div>
              <Link to="/login" onClick={() => setIsOpen(false)}>
                <Button variant="ghost" className="w-full btn-ghost">
                  {t('login')}
                </Button>
              </Link>
              <Link to="/register" onClick={() => setIsOpen(false)}>
                <Button className="w-full btn-primary">
                  {t('getStarted')}
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;