import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, ArrowDown, Sparkles } from 'lucide-react';
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

  // Target date: July 24, 2026 at midnight
  const targetDate = useMemo(() => new Date('2026-07-24T00:00:00'), []);

  const calculateTimeLeft = (): TimeLeft => {
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
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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

  // Floating particles
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 2 + Math.random() * 2,
  }));

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${heroImage})`,
          transform: `translateY(${scrollY * 0.5}px)`,
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 gradient-hero-overlay" />

      {/* Floating Particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-2 h-2 rounded-full bg-gold"
          style={{ left: `${particle.x}%`, top: `${particle.y}%` }}
          animate={{
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.5, 1],
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
        {/* Logo with Sparkles */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, type: 'spring', stiffness: 100 }}
          className="relative inline-block mb-8"
        >
          <img src={logo} alt="Diaspora 2026" className="h-24 w-24 md:h-32 md:w-32 mx-auto" />
          {/* Sparkles around logo */}
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                top: i < 2 ? '-10px' : 'auto',
                bottom: i >= 2 ? '-10px' : 'auto',
                left: i % 2 === 0 ? '-10px' : 'auto',
                right: i % 2 !== 0 ? '-10px' : 'auto',
              }}
              animate={{
                opacity: [0.5, 1, 0.5],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            >
              <Sparkles className="h-5 w-5 text-gold" />
            </motion.div>
          ))}
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-3xl md:text-5xl lg:text-6xl font-bold text-primary-foreground text-shadow mb-4"
        >
          {t('hero_title')}
        </motion.h1>

        {/* Subtitle with gradient */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-4xl md:text-6xl lg:text-8xl font-bold text-gradient-gold text-shadow-lg mb-8"
        >
          {t('hero_subtitle')}
        </motion.h2>

        {/* Date & Location Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          <div className="flex items-center gap-2 px-6 py-3 rounded-full border-2 border-gold/50 bg-primary-foreground/10 backdrop-blur-sm">
            <Calendar className="h-5 w-5 text-gold" />
            <span className="text-primary-foreground font-medium">{t('hero_date')}</span>
          </div>
          <div className="flex items-center gap-2 px-6 py-3 rounded-full border-2 border-destructive/50 bg-primary-foreground/10 backdrop-blur-sm">
            <MapPin className="h-5 w-5 text-destructive" />
            <span className="text-primary-foreground font-medium">{t('hero_location')}</span>
          </div>
        </motion.div>

        {/* Countdown Timer */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-12"
        >
          {countdownItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="relative group"
            >
              <div className="bg-primary-foreground/10 backdrop-blur-md rounded-2xl p-6 border border-primary-foreground/20">
                <motion.span
                  key={item.value}
                  initial={{ opacity: 0, rotateX: 90 }}
                  animate={{ opacity: 1, rotateX: 0 }}
                  className="block text-4xl md:text-5xl font-bold text-primary-foreground"
                >
                  {item.value.toString().padStart(2, '0')}
                </motion.span>
                <span className="text-sm text-primary-foreground/70 uppercase tracking-wider mt-2 block">
                  {item.label}
                </span>
              </div>
              {/* Glow effect on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gold/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300 -z-10" />
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.3 }}
          onClick={scrollToRegister}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="shimmer relative inline-flex items-center gap-3 px-10 py-5 rounded-full gradient-emerald text-primary-foreground font-semibold text-lg shadow-lg glow-emerald hover:shadow-xl transition-all duration-300 group"
        >
          {t('hero_cta')}
          <motion.span
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            →
          </motion.span>
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
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ArrowDown className="h-8 w-8 text-primary-foreground/50" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
