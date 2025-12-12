import { motion } from 'framer-motion';
import { Download, Share2, Sparkles } from 'lucide-react';
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
      navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
    }
  };

  return (
    <section id="flyer" className="section-padding bg-background relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-destructive/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-gold font-medium tracking-[0.2em] uppercase text-sm mb-4">
            <Sparkles className="inline h-4 w-4 mr-2" />
            {language === 'fr' ? 'Téléchargement' : 'Download'}
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
            {t('flyer_title')}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-6" />
          <p className="text-lg text-muted-foreground">
            {t('flyer_subtitle')}
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20">
          {/* Flyer Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative group"
          >
            {/* Decorative frame */}
            <motion.div
              className="absolute -inset-4 rounded-3xl"
              style={{
                background: 'linear-gradient(135deg, hsl(51 100% 50% / 0.3), transparent, hsl(356 84% 50% / 0.3))',
              }}
              animate={{ rotate: [0, 1, 0, -1, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
            />
            
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <motion.img
                src={currentFlyer}
                alt={`Flyer Diaspora 2026 ${language.toUpperCase()}`}
                className="w-full max-w-md object-cover"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.5 }}
              />
              
              {/* Hover overlay */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-t from-navy-dark/90 via-navy-dark/50 to-transparent flex items-end justify-center pb-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              >
                <span className="text-primary-foreground font-medium flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-gold" />
                  {t('flyer_view')}
                </span>
              </motion.div>
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
              whileHover={{ scale: 1.03, y: -3 }}
              whileTap={{ scale: 0.97 }}
              className="group relative flex items-center justify-center gap-3 px-10 py-5 rounded-2xl bg-gradient-to-r from-destructive to-red-light text-destructive-foreground font-semibold shadow-xl overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-3">
                <Download className="h-5 w-5" />
                {t('flyer_download')}
              </span>
              {/* Shimmer */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              />
            </motion.button>

            <motion.button
              onClick={handleShare}
              whileHover={{ scale: 1.03, y: -3 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center justify-center gap-3 px-10 py-5 rounded-2xl bg-card border-2 border-navy text-navy font-semibold shadow-lg hover:bg-navy hover:text-primary-foreground transition-all duration-300"
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
