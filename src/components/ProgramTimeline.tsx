import { motion } from 'framer-motion';
import { Calendar, BookOpen, Sunrise } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const ProgramTimeline = () => {
  const { t } = useLanguage();

  const days = [
    {
      icon: Sunrise,
      date: t('program_day1_date'),
      title: t('program_day1_title'),
      color: 'border-destructive',
      bgColor: 'bg-destructive/10',
      iconColor: 'text-destructive',
    },
    {
      icon: BookOpen,
      date: t('program_day2_date'),
      title: t('program_day2_title'),
      color: 'border-navy',
      bgColor: 'bg-navy/10',
      iconColor: 'text-navy',
    },
    {
      icon: Calendar,
      date: t('program_day3_date'),
      title: t('program_day3_title'),
      color: 'border-gold',
      bgColor: 'bg-gold/10',
      iconColor: 'text-gold',
    },
  ];

  return (
    <section id="program" className="section-padding bg-card">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            {t('program_title')}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t('program_subtitle')}
          </p>
        </motion.div>

        {/* Timeline */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            visible: { transition: { staggerChildren: 0.2 } },
          }}
          className="grid md:grid-cols-3 gap-6 mb-12"
        >
          {days.map((day, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
              whileHover={{ scale: 1.03, y: -5 }}
              className={`bg-card rounded-2xl p-8 shadow-lg border-l-4 ${day.color} card-hover`}
            >
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${day.bgColor} mb-4`}>
                <day.icon className={`h-7 w-7 ${day.iconColor}`} />
              </div>
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">
                Jour {index + 1}
              </div>
              <div className="text-lg font-bold text-foreground mb-2">{day.date}</div>
              <h3 className="text-xl font-semibold text-foreground">{day.title}</h3>
            </motion.div>
          ))}
        </motion.div>

        {/* Formation Continue */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="bg-gradient-to-r from-navy to-navy-dark rounded-3xl p-8 md:p-12 text-center"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
            {t('program_formation_title')}
          </h3>
          <p className="text-lg text-primary-foreground/80 mb-2">
            {t('program_formation_dates')}
          </p>
          <p className="text-sm text-primary-foreground/60 italic">
            {t('program_formation_note')}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ProgramTimeline;
