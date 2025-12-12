import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import logo from '@/assets/logo.png';

const AboutSection = () => {
  const { t } = useLanguage();

  const organizations = [
    { name: t('about_org1') },
    { name: t('about_org2') },
    { name: t('about_org3') },
  ];

  return (
    <section id="about" className="section-padding bg-secondary">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-2 rounded-full bg-navy/10 text-navy font-medium text-sm mb-4"
          >
            {t('about_subtitle')}
          </motion.span>

          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            {t('about_title')}
          </h2>

          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-4">
            {t('about_description')}
          </p>

          <p className="text-gold font-medium italic text-lg">
            — {t('about_verse')}
          </p>
        </motion.div>

        {/* Organizers */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            visible: { transition: { staggerChildren: 0.15 } },
          }}
          className="grid md:grid-cols-3 gap-6"
        >
          {organizations.map((org, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-card rounded-2xl p-8 shadow-lg border border-border text-center card-hover"
            >
              <img src={logo} alt={org.name} className="h-16 w-16 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground">{org.name}</h3>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
