import { motion } from 'framer-motion';
import { MapPin, Home, Plane, UtensilsCrossed, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const PracticalInfo = () => {
  const { t } = useLanguage();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const infoCards = [
    { icon: MapPin, title: t('info_location_title'), desc: t('info_location_desc'), color: 'text-destructive' },
    { icon: Home, title: t('info_accommodation_title'), desc: t('info_accommodation_desc'), color: 'text-navy' },
    { icon: Plane, title: t('info_transport_title'), desc: t('info_transport_desc'), color: 'text-emerald' },
    { icon: UtensilsCrossed, title: t('info_food_title'), desc: t('info_food_desc'), color: 'text-gold' },
  ];

  const faqs = [
    { q: t('faq_q1'), a: t('faq_a1') },
    { q: t('faq_q2'), a: t('faq_a2') },
    { q: t('faq_q3'), a: t('faq_a3') },
    { q: t('faq_q4'), a: t('faq_a4') },
    { q: t('faq_q5'), a: t('faq_a5') },
  ];

  return (
    <section id="info" className="section-padding bg-card">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            {t('info_title')}
          </h2>
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
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {infoCards.map((card, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
              whileHover={{ scale: 1.03, y: -5 }}
              className="bg-secondary rounded-2xl p-6 shadow-md card-hover"
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-card mb-4`}>
                <card.icon className={`h-6 w-6 ${card.color}`} />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{card.title}</h3>
              <p className="text-sm text-muted-foreground">{card.desc}</p>
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
          <h3 className="text-2xl font-bold text-foreground text-center mb-8">
            {t('faq_title')}
          </h3>

          <div className="space-y-4">
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
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="font-medium text-foreground pr-4">{faq.q}</span>
                  <motion.div
                    animate={{ rotate: openFaq === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  </motion.div>
                </button>
                <motion.div
                  initial={false}
                  animate={{
                    height: openFaq === index ? 'auto' : 0,
                    opacity: openFaq === index ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-5 text-muted-foreground">{faq.a}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-8 text-muted-foreground"
          >
            {t('faq_contact')}:{' '}
            <a
              href="mailto:sfdrm.lwm@gmail.com"
              className="text-destructive hover:underline font-medium"
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
