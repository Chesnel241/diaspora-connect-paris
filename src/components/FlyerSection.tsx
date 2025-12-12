import { motion } from 'framer-motion';
import { Download, Share2, Eye } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import flyerFr from '@/assets/flyer-fr.png';
import flyerEn from '@/assets/flyer-en.png';

const FlyerSection = () => {
  const { language, t } = useLanguage();

  const currentFlyer = language === 'fr' ? flyerFr : flyerEn;
  const flyerName = language === 'fr' ? 'Flyer-Diaspora-2026-FR.png' : 'Flyer-Diaspora-2026-EN.png';

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = currentFlyer;
    link.download = flyerName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Diaspora 2026',
      text: t('share_message'),
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
    }
  };

  return (
    <section id="flyer" className="section-padding bg-secondary">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            {t('flyer_title')}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t('flyer_subtitle')}
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
          {/* Flyer Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            whileHover={{ scale: 1.02 }}
            className="relative group"
          >
            {/* Decorative corners */}
            <motion.div
              className="absolute -top-4 -left-4 w-16 h-16 border-l-4 border-t-4 border-destructive rounded-tl-xl"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div
              className="absolute -bottom-4 -right-4 w-16 h-16 border-r-4 border-b-4 border-gold rounded-br-xl"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            />

            <div className="relative overflow-hidden rounded-2xl shadow-2xl border-8 border-primary-foreground">
              <img
                src={currentFlyer}
                alt={`Flyer Diaspora 2026 ${language.toUpperCase()}`}
                className="w-full max-w-md object-cover"
              />

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="flex items-center gap-2 text-primary-foreground font-medium">
                  <Eye className="h-6 w-6" />
                  <span>{t('flyer_view')}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col gap-4"
          >
            <motion.button
              onClick={handleDownload}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              className="shimmer flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-destructive to-red-light text-destructive-foreground font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Download className="h-5 w-5" />
              {t('flyer_download')}
            </motion.button>

            <motion.button
              onClick={handleShare}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-card border-2 border-navy text-navy font-semibold shadow-lg hover:shadow-xl hover:bg-navy hover:text-primary-foreground transition-all duration-300"
            >
              <Share2 className="h-5 w-5" />
              {t('flyer_share')}
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FlyerSection;
