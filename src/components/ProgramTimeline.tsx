import { motion } from 'framer-motion';
import { Calendar, BookOpen, Sunrise, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const ProgramTimeline = () => {
  const { t, language } = useLanguage();

  const days = [
    {
      icon: Sunrise,
      day: language === 'fr' ? 'Jour 1' : 'Day 1',
      date: t('program_day1_date'),
      title: t('program_day1_title'),
      gradient: 'from-destructive/20 to-destructive/5',
      borderColor: 'border-destructive',
      iconBg: 'bg-destructive/10',
      iconColor: 'text-destructive',
    },
    {
      icon: BookOpen,
      day: language === 'fr' ? 'Jour 2' : 'Day 2',
      date: t('program_day2_date'),
      title: t('program_day2_title'),
      gradient: 'from-navy/20 to-navy/5',
      borderColor: 'border-navy',
      iconBg: 'bg-navy/10',
      iconColor: 'text-navy',
    },
    {
      icon: Calendar,
      day: language === 'fr' ? 'Jour 3' : 'Day 3',
      date: t('program_day3_date'),
      title: t('program_day3_title'),
      gradient: 'from-gold/20 to-gold/5',
      borderColor: 'border-gold',
      iconBg: 'bg-gold/10',
      iconColor: 'text-gold',
    },
  ];

  return (
    <section id="program" className="section-padding bg-secondary/50 relative">
      {/* Decorative line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-gold font-medium tracking-[0.2em] uppercase text-sm mb-4">
            {language === 'fr' ? 'Agenda' : 'Agenda'}
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
            {t('program_title')}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-6" />
          <p className="text-lg text-muted-foreground">
            {t('program_subtitle')}
          </p>
        </motion.div>

        {/* Timeline Cards */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            visible: { transition: { staggerChildren: 0.2 } },
          }}
          className="grid md:grid-cols-3 gap-6 mb-16"
        >
          {days.map((day, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0 },
              }}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.4 }}
              className="group relative"
            >
              <div className={`bg-card rounded-2xl overflow-hidden shadow-lg border-l-4 ${day.borderColor} h-full`}>
                {/* Gradient header */}
                <div className={`bg-gradient-to-r ${day.gradient} p-6`}>
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${day.iconBg}`}>
                    <day.icon className={`h-7 w-7 ${day.iconColor}`} />
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {day.day}
                    </span>
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm font-medium text-gold">{day.date}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground group-hover:text-gold transition-colors duration-300">
                    {day.title}
                  </h3>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Formation Continue */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative"
        >
          <div className="bg-gradient-to-r from-navy via-navy-dark to-navy rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
            {/* Decorative elements */}
            <motion.div 
              className="absolute top-4 right-4 w-24 h-24 border border-gold/20 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div 
              className="absolute bottom-4 left-4 w-16 h-16 border border-gold/20 rounded-full"
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            />
            
            <span className="inline-block text-gold/80 font-medium tracking-[0.2em] uppercase text-xs mb-4">
              {language === 'fr' ? 'Programme Étendu' : 'Extended Program'}
            </span>
            <h3 className="font-display text-2xl md:text-4xl font-bold text-primary-foreground mb-4">
              {t('program_formation_title')}
            </h3>
            <p className="text-lg text-primary-foreground/80 mb-3">
              {t('program_formation_dates')}
            </p>
            <p className="text-sm text-primary-foreground/50 italic max-w-xl mx-auto">
              {t('program_formation_note')}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProgramTimeline;
