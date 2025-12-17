import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import logo from '@/assets/logo.png';
import EventsCarousel from './EventsCarousel';

const AboutSection = () => {
  const { t, language } = useLanguage();

  const organizations = [
    { name: t('about_org1') },
    { name: t('about_org2') },
    { name: t('about_org3') },
  ];

  return (
    <section id="about" className="section-padding bg-background relative overflow-hidden">
      <div className="container mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <span className="inline-block text-gold font-medium tracking-[0.2em] uppercase text-sm mb-4">
            {language === 'fr' ? 'À propos' : 'About'}
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            {t('about_title')}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-8" />
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t('about_subtitle')}
          </p>
        </motion.div>

        {/* Events Photo Carousel */}
        <EventsCarousel />

        {/* Mission Statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative mb-20"
        >
          <div className="bg-gradient-to-br from-navy to-navy-dark rounded-3xl p-10 md:p-16 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-gold/20 rounded-tl-3xl" />
            <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-gold/20 rounded-br-3xl" />
            <p className="font-display text-2xl md:text-3xl lg:text-4xl text-primary-foreground leading-relaxed italic">
              "{t('about_description')}"
            </p>
            <p className="mt-6 text-gold font-medium">— {t('about_verse')}</p>
          </div>
        </motion.div>

        {/* Organizations */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
          className="grid md:grid-cols-3 gap-6 md:gap-8"
        >
          {organizations.map((org, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.4 }}
              className="group bg-card rounded-2xl p-8 shadow-lg border border-border/50 text-center"
            >
              <img src={logo} alt={org.name} className="h-20 w-20 mx-auto mb-6" />
              <h3 className="text-lg font-semibold text-foreground group-hover:text-gold transition-colors duration-300">
                {org.name}
              </h3>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
