import { motion } from 'framer-motion';
import { MessageCircle, Mail, MessageSquare } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const ShareSection = () => {
  const { t } = useLanguage();

  const shareMessage = encodeURIComponent(t('share_message'));
  const shareUrl = encodeURIComponent(window.location.href);

  const shareOptions = [
    {
      name: t('share_whatsapp'),
      icon: MessageCircle,
      color: 'bg-[#25D366] hover:bg-[#20BD5A]',
      href: `https://wa.me/?text=${shareMessage}%20${shareUrl}`,
    },
    {
      name: t('share_email'),
      icon: Mail,
      color: 'bg-navy hover:bg-navy-dark',
      href: `mailto:?subject=Diaspora%202026&body=${shareMessage}%20${shareUrl}`,
    },
    {
      name: t('share_sms'),
      icon: MessageSquare,
      color: 'bg-[#FF9500] hover:bg-[#E68600]',
      href: `sms:?&body=${shareMessage}%20${shareUrl}`,
    },
  ];

  return (
    <section className="section-padding bg-card">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('share_title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('share_subtitle')}
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          className="grid md:grid-cols-3 gap-6"
        >
          {shareOptions.map((option, index) => (
            <motion.a
              key={index}
              href={option.href}
              target="_blank"
              rel="noopener noreferrer"
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center justify-center gap-3 px-8 py-6 rounded-2xl text-primary-foreground font-semibold text-lg shadow-lg transition-all duration-300 ${option.color}`}
            >
              <option.icon className="h-6 w-6" />
              {option.name}
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ShareSection;
