import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, ArrowDown } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import heroImage from '@/assets/paris-hero.jpg';
import logo from '@/assets/logo.png';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const HeroSection = () => {
  const { t } = useLanguage();
  const [scrollY, setScrollY] = useState(0);

  const targetDate = useMemo(() => new Date('2026-07-24T00:00:00'), []);

  const calculateTimeLeft = useCallback((): TimeLeft => {
    const difference = targetDate.getTime() - new Date().getTime();
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }, [targetDate]);

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToRegister = () => {
    const element = document.getElementById('register');
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const countdownItems = [
    { value: timeLeft.days, label: t('hero_days') },
    { value: timeLeft.hours, label: t('hero_hours') },
    { value: timeLeft.minutes, label: t('hero_minutes') },
    { value: timeLeft.seconds, label: t('hero_seconds') },
  ];

  // Floating particles with varied sizes
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 2 + Math.random() * 4,
    delay: Math.random() * 3,
    duration: 3 + Math.random() * 2,
  }));

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110"
        style={{
          backgroundImage: `url(${heroImage})`,
          transform: `translateY(${scrollY * 0.3}px) scale(1.1)`,
        }}
      />

      {/* Overlay with gradient */}
      <div className="absolute inset-0 gradient-hero-overlay" />
      
      {/* Animated gradient overlay */}
      <motion.div 
        className="absolute inset-0 opacity-30"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, hsla(213, 56%, 10%, 0.8) 100%)',
        }}
      />

      {/* Floating Particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-gold/60"
          style={{ 
            left: `${particle.x}%`, 
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.5, 1],
            y: [0, -30, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, type: 'spring', stiffness: 100 }}
          className="relative inline-block mb-6"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full border-2 border-dashed border-gold/30"
            style={{ width: 'calc(100% + 20px)', height: 'calc(100% + 20px)', top: -10, left: -10 }}
          />
          <img src={logo} alt="Diaspora 2026" className="h-28 w-28 md:h-36 md:w-36 mx-auto" />
        </motion.div>

        {/* Title */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-gold font-medium tracking-[0.3em] uppercase text-sm md:text-base mb-4"
        >
          {t('hero_title')}
        </motion.p>

        {/* Main Title with elegant typography */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-primary-foreground mb-6"
        >
          <span className="text-gradient-gold">{t('hero_subtitle')}</span>
        </motion.h1>

        {/* Date & Location Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          <div className="glass flex items-center gap-3 px-6 py-3 rounded-full">
            <Calendar className="h-5 w-5 text-gold" />
            <span className="text-primary-foreground font-medium">{t('hero_date')}</span>
          </div>
          <div className="glass flex items-center gap-3 px-6 py-3 rounded-full">
            <MapPin className="h-5 w-5 text-destructive" />
            <span className="text-primary-foreground font-medium">{t('hero_location')}</span>
          </div>
        </motion.div>

        {/* Countdown Timer */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="flex flex-wrap justify-center gap-3 md:gap-6 max-w-4xl mx-auto mb-14"
        >
          {countdownItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + index * 0.1 }}
              className="relative group"
            >
              <motion.div 
                className="glass rounded-2xl px-6 py-5 md:px-10 md:py-8 min-w-[90px] md:min-w-[140px]"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <motion.span
                  key={item.value}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="block font-display text-4xl md:text-6xl font-bold text-primary-foreground"
                >
                  {item.value.toString().padStart(2, '0')}
                </motion.span>
                <span className="text-xs md:text-sm text-primary-foreground/60 uppercase tracking-widest mt-2 block">
                  {item.label}
                </span>
              </motion.div>
              {/* Separator dots */}
              {index < 3 && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 hidden md:flex flex-col gap-2 z-10">
                  <motion.div 
                    className="w-2 h-2 rounded-full bg-gold"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  <motion.div 
                    className="w-2 h-2 rounded-full bg-gold"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
                  />
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          onClick={scrollToRegister}
          whileHover={{ scale: 1.05, y: -3 }}
          whileTap={{ scale: 0.95 }}
          className="group relative inline-flex items-center gap-3 px-10 py-5 rounded-full gradient-emerald text-primary-foreground font-semibold text-lg shadow-2xl glow-emerald transition-all duration-300"
        >
          <span className="relative z-10">{t('hero_cta')}</span>
          <motion.span
            className="relative z-10"
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            →
          </motion.span>
          {/* Shimmer effect */}
          <div className="absolute inset-0 rounded-full overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
          </div>
        </motion.button>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-xs text-primary-foreground/50 uppercase tracking-widest">Scroll</span>
            <ArrowDown className="h-5 w-5 text-primary-foreground/50" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
