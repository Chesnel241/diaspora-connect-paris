import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import logo from '@/assets/logo.png';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { id: 'about', label: t('nav_about') },
    { id: 'program', label: t('nav_program') },
    { id: 'flyer', label: t('nav_flyer') },
    { id: 'info', label: t('nav_info') },
    { id: 'inscription', label: t('nav_register') },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-card/95 backdrop-blur-nav shadow-lg py-2'
            : 'bg-transparent py-4'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-3 cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <img src={logo} alt="Diaspora 2026" className="h-12 w-12" />
              <div className={`hidden sm:block transition-colors duration-300 ${isScrolled ? 'text-foreground' : 'text-primary-foreground'}`}>
                <p className="font-display font-semibold text-lg leading-tight tracking-wide">DIASPORA 2026</p>
                <p className="text-xs opacity-70 tracking-wider">{t('nav_subtitle')}</p>
              </div>
            </motion.button>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <motion.button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className={`relative px-4 py-2 font-medium text-sm transition-colors ${
                    isScrolled
                      ? 'text-foreground hover:text-gold'
                      : 'text-primary-foreground/90 hover:text-gold'
                  }`}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {link.label}
                  <motion.div
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-gold rounded-full"
                    initial={{ width: 0 }}
                    whileHover={{ width: '60%' }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.button>
              ))}
            </div>

            {/* Language Switcher & Mobile Menu */}
            <div className="flex items-center gap-3">
              {/* Language Switcher */}
              <div className={`flex items-center p-1 rounded-full transition-colors ${isScrolled ? 'bg-secondary' : 'bg-primary-foreground/10'}`}>
                <motion.button
                  onClick={() => setLanguage('fr')}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    language === 'fr'
                      ? 'bg-gold text-navy'
                      : isScrolled
                      ? 'text-foreground hover:text-gold'
                      : 'text-primary-foreground hover:text-gold'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  FR
                </motion.button>
                <motion.button
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    language === 'en'
                      ? 'bg-gold text-navy'
                      : isScrolled
                      ? 'text-foreground hover:text-gold'
                      : 'text-primary-foreground hover:text-gold'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  EN
                </motion.button>
              </div>

              {/* Mobile Menu Button */}
              <motion.button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`lg:hidden p-2.5 rounded-xl transition-colors ${
                  isScrolled ? 'text-foreground hover:bg-secondary' : 'text-primary-foreground hover:bg-primary-foreground/10'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-navy-dark/90 backdrop-blur-lg"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-80 max-w-full bg-card shadow-2xl"
            >
              <div className="p-8 pt-28">
                <div className="space-y-2">
                  {navLinks.map((link, index) => (
                    <motion.button
                      key={link.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => scrollToSection(link.id)}
                      className="block w-full text-left text-lg font-medium text-foreground hover:text-gold py-4 border-b border-border/50 transition-colors"
                    >
                      {link.label}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;
