import { motion } from 'framer-motion';
import { Calendar, BookOpen, Sunrise, Sparkles, Star, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const ProgramTimeline = () => {
  const { t, language } = useLanguage();

  const days = [
    {
      icon: Sunrise,
      day: language === 'fr' ? 'Jour 1' : 'Day 1',
      date: t('program_day1_date'),
      title: t('program_day1_title'),
      gradient: 'from-destructive via-destructive/80 to-destructive/60',
      glowColor: 'shadow-destructive/30',
      accent: 'bg-destructive',
      number: '01',
    },
    {
      icon: BookOpen,
      day: language === 'fr' ? 'Jour 2' : 'Day 2',
      date: t('program_day2_date'),
      title: t('program_day2_title'),
      gradient: 'from-navy via-navy/80 to-navy/60',
      glowColor: 'shadow-navy/30',
      accent: 'bg-navy',
      number: '02',
    },
    {
      icon: Calendar,
      day: language === 'fr' ? 'Jour 3' : 'Day 3',
      date: t('program_day3_date'),
      title: t('program_day3_title'),
      gradient: 'from-gold via-gold/80 to-gold/60',
      glowColor: 'shadow-gold/30',
      accent: 'bg-gold',
      number: '03',
    },
  ];

  return (
    <section id="program" className="section-padding bg-gradient-to-b from-background via-secondary/30 to-background relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-20 left-10 w-72 h-72 bg-gold/5 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-20 right-10 w-96 h-96 bg-navy/5 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>
      
      <div className="container mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 rounded-full px-5 py-2 mb-6"
          >
            <Sparkles className="h-4 w-4 text-gold" />
            <span className="text-gold font-medium tracking-wider uppercase text-sm">
              {language === 'fr' ? 'Agenda' : 'Agenda'}
            </span>
          </motion.div>
          
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            {t('program_title')}
          </h2>
          
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold" />
            <Star className="h-5 w-5 text-gold fill-gold" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold" />
          </div>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('program_subtitle')}
          </p>
        </motion.div>

        {/* Timeline Cards - Horizontal on desktop */}
        <div className="relative">
          {/* Connecting line - desktop only */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-destructive via-navy to-gold transform -translate-y-1/2 opacity-20 rounded-full" />
          
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              visible: { transition: { staggerChildren: 0.2 } },
            }}
            className="grid md:grid-cols-3 gap-8 lg:gap-12"
          >
            {days.map((day, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 50, scale: 0.9 },
                  visible: { opacity: 1, y: 0, scale: 1 },
                }}
                whileHover={{ y: -12, scale: 1.02 }}
                transition={{ duration: 0.4 }}
                className="group relative"
              >
                {/* Large number background */}
                <div className="absolute -top-8 -left-4 font-display text-[120px] font-bold text-foreground/[0.03] leading-none pointer-events-none select-none">
                  {day.number}
                </div>
                
                <div className={`relative bg-card rounded-3xl overflow-hidden shadow-xl ${day.glowColor} shadow-2xl border border-border/50 h-full transition-all duration-500 group-hover:shadow-3xl`}>
                  {/* Gradient top bar */}
                  <div className={`h-2 bg-gradient-to-r ${day.gradient}`} />
                  
                  {/* Icon circle */}
                  <div className="relative pt-8 pb-4 px-8">
                    <motion.div 
                      className={`relative inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${day.gradient} shadow-lg`}
                      whileHover={{ rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <day.icon className="h-10 w-10 text-white" />
                      
                      {/* Sparkle decorations */}
                      <motion.div
                        className="absolute -top-1 -right-1 w-3 h-3 bg-gold rounded-full"
                        animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                      />
                    </motion.div>
                  </div>
                  
                  {/* Content */}
                  <div className="px-8 pb-8">
                    <div className="flex items-center gap-3 mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${day.accent} text-white`}>
                        {day.day}
                      </span>
                      <span className="text-sm font-semibold text-gold">{day.date}</span>
                    </div>
                    
                    <h3 className="text-xl md:text-2xl font-bold text-foreground group-hover:text-gold transition-colors duration-300 leading-tight">
                      {day.title}
                    </h3>
                    
                    {/* Decorative bottom line */}
                    <motion.div 
                      className={`mt-6 h-1 rounded-full bg-gradient-to-r ${day.gradient} origin-left`}
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + index * 0.2, duration: 0.6 }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Registration CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex justify-center mt-12 mb-20"
          >
            <motion.a
              href="#inscription"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="group inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold px-8 py-4 rounded-full shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-300"
            >
              <span className="text-lg">
                {language === 'fr' ? "Je m'inscris maintenant" : "Register Now"}
              </span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </motion.a>
          </motion.div>
        </div>

        {/* Formation Continue - Enhanced */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative"
        >
          <div className="relative bg-gradient-to-br from-navy via-navy-dark to-navy rounded-[2rem] p-1 overflow-hidden">
            {/* Animated border gradient */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-gold via-destructive to-gold opacity-50"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              style={{ background: 'conic-gradient(from 0deg, hsl(var(--gold)), hsl(var(--destructive)), hsl(var(--gold)))' }}
            />
            
            <div className="relative bg-gradient-to-br from-navy via-navy-dark to-navy rounded-[1.8rem] p-10 md:p-16 text-center">
              {/* Decorative elements */}
              <div className="absolute inset-0 overflow-hidden">
                <motion.div 
                  className="absolute top-6 right-6 w-32 h-32 border-2 border-gold/20 rounded-full"
                  animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                />
                <motion.div 
                  className="absolute bottom-6 left-6 w-24 h-24 border-2 border-gold/20 rounded-full"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                />
                <motion.div 
                  className="absolute top-1/2 left-1/4 w-2 h-2 bg-gold/40 rounded-full"
                  animate={{ y: [-10, 10, -10], opacity: [0.3, 0.8, 0.3] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                <motion.div 
                  className="absolute top-1/3 right-1/4 w-3 h-3 bg-gold/30 rounded-full"
                  animate={{ y: [10, -10, 10], opacity: [0.3, 0.8, 0.3] }}
                  transition={{ duration: 5, repeat: Infinity }}
                />
              </div>
              
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, type: 'spring' }}
                className="inline-flex items-center gap-2 bg-gold/20 border border-gold/40 rounded-full px-5 py-2 mb-6"
              >
                <BookOpen className="h-4 w-4 text-gold" />
                <span className="text-gold font-medium tracking-wider uppercase text-xs">
                  {language === 'fr' ? 'Programme Étendu' : 'Extended Program'}
                </span>
              </motion.div>
              
              <h3 className="font-display text-3xl md:text-5xl font-bold text-white mb-6 relative">
                {t('program_formation_title')}
              </h3>
              
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-gold/50" />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                >
                  <Star className="h-6 w-6 text-gold fill-gold/30" />
                </motion.div>
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-gold/50" />
              </div>
              
              <p className="text-xl md:text-2xl text-white/90 mb-4 font-medium">
                {t('program_formation_dates')}
              </p>
              
              <p className="text-sm text-white/50 italic max-w-xl mx-auto">
                {t('program_formation_note')}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProgramTimeline;
