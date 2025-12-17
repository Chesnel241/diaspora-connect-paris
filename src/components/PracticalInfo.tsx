import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Home, Plane, UtensilsCrossed, ChevronDown, HelpCircle } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const PracticalInfo = () => {
  const { t, language } = useLanguage();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const infoCards = [
    { 
      icon: MapPin, 
      title: t('info_location_title'), 
      desc: t('info_location_desc'), 
      gradient: 'from-destructive/10 to-transparent',
      iconColor: 'text-destructive',
      iconBg: 'bg-destructive/10',
    },
    { 
      icon: Home, 
      title: t('info_accommodation_title'), 
      desc: t('info_accommodation_desc'), 
      gradient: 'from-navy/10 to-transparent',
      iconColor: 'text-navy',
      iconBg: 'bg-navy/10',
    },
    { 
      icon: Plane, 
      title: t('info_transport_title'), 
      desc: t('info_transport_desc'), 
      gradient: 'from-emerald/10 to-transparent',
      iconColor: 'text-emerald',
      iconBg: 'bg-emerald/10',
    },
    { 
      icon: UtensilsCrossed, 
      title: t('info_food_title'), 
      desc: t('info_food_desc'), 
      gradient: 'from-gold/10 to-transparent',
      iconColor: 'text-gold',
      iconBg: 'bg-gold/10',
    },
  ];

  const faqs = [
    { q: t('faq_q1'), a: t('faq_a1') },
    { q: t('faq_q2'), a: t('faq_a2') },
    { q: t('faq_q3'), a: t('faq_a3') },
    { q: t('faq_q4'), a: t('faq_a4') },
    { q: t('faq_q5'), a: t('faq_a5') },
  ];

  return (
    <section id="info" className="section-padding bg-card relative">
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
            {language === 'fr' ? 'Guide' : 'Guide'}
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
            {t('info_title')}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-6" />
          <p className="text-lg text-muted-foreground">
            {t('info_subtitle')}
          </p>
        </motion.div>

        {/* Info Cards */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
        >
          {infoCards.map((card, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.4 }}
              className="group bg-secondary rounded-2xl p-6 relative overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              <div className="relative z-10">
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${card.iconBg} mb-5`}>
                  <card.icon className={`h-7 w-7 ${card.iconColor}`} />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-3 group-hover:text-gold transition-colors duration-300">
                  {card.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{card.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto"
        >
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 text-gold font-medium tracking-wider uppercase text-sm mb-4">
              <HelpCircle className="h-4 w-4" />
              FAQ
            </span>
            <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground">
              {t('faq_title')}
            </h3>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-secondary rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-secondary/80 transition-colors"
                >
                  <span className="font-medium text-foreground pr-4">{faq.q}</span>
                  <motion.div
                    animate={{ rotate: openFaq === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0"
                  >
                    <ChevronDown className={`h-5 w-5 transition-colors ${openFaq === index ? 'text-gold' : 'text-muted-foreground'}`} />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pt-0">
                        <div className="h-px bg-border mb-4" />
                        <p className="text-muted-foreground">{faq.a}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-10 text-muted-foreground"
          >
            {t('faq_contact')}:{' '}
            <a
              href="mailto:sfdrm.lwm@gmail.com"
              className="text-gold hover:underline font-medium transition-colors"
            >
              sfdrm.lwm@gmail.com
            </a>
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default PracticalInfo;
