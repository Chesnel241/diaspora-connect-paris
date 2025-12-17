import { motion } from 'framer-motion';
import { Mail, Phone, ExternalLink, Heart } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import logo from '@/assets/logo.png';

const Footer = () => {
  const { t, language } = useLanguage();

  const organizations = [
    t('about_org1'),
    t('about_org2'),
    t('about_org3'),
  ];

  return (
    <footer className="bg-navy-dark text-primary-foreground relative overflow-hidden">
      {/* Decorative top border */}
      <div className="h-1 bg-gradient-to-r from-gold via-destructive to-gold" />
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-destructive/5 rounded-full blur-3xl translate-y-1/2" />

      <div className="container mx-auto px-4 py-16 relative">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Logo & Org */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-4 mb-8">
              <img src={logo} alt="Diaspora 2026" className="h-16 w-16" />
              <div>
                <p className="font-display font-bold text-2xl tracking-wide">DIASPORA 2026</p>
                <p className="text-sm text-primary-foreground/60">Paris • {language === 'fr' ? 'Juillet' : 'July'} 2026</p>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold mb-4">
                {t('footer_organized_by')}
              </h4>
              <ul className="space-y-2">
                {organizations.map((org, i) => (
                  <li key={i} className="text-primary-foreground/70 text-sm">
                    {org}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold mb-6">
              {t('footer_contact')}
            </h4>

            <div className="space-y-4">
              <a
                href="mailto:sfdrm.lwm@gmail.com"
                className="flex items-center gap-3 text-primary-foreground/80 hover:text-gold transition-colors group"
              >
                <div className="p-2 rounded-lg bg-primary-foreground/5 group-hover:bg-gold/10 transition-colors">
                  <Mail className="h-5 w-5" />
                </div>
                <span className="text-sm">sfdrm.lwm@gmail.com</span>
              </a>

              <a
                href="tel:+33676565157"
                className="flex items-center gap-3 text-primary-foreground/80 hover:text-gold transition-colors group"
              >
                <div className="p-2 rounded-lg bg-primary-foreground/5 group-hover:bg-gold/10 transition-colors">
                  <Phone className="h-5 w-5" />
                </div>
                <span className="text-sm">+33 6 76 56 51 57</span>
              </a>
            </div>
          </motion.div>

          {/* Social */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold mb-6">
              {t('footer_follow')}
            </h4>

            <motion.a
              href="https://linktr.ee/diaspora_life_word_mission"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-primary-foreground/5 hover:bg-gold/20 border border-primary-foreground/10 hover:border-gold/30 transition-all duration-300"
            >
              <ExternalLink className="h-5 w-5" />
              <span className="font-medium">Linktree</span>
            </motion.a>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="border-t border-primary-foreground/10 pt-8">
          <p className="text-center text-sm text-primary-foreground/50 flex items-center justify-center gap-2">
            © 2026 Diaspora Life Word Mission. {t('footer_rights')}
            <Heart className="h-4 w-4 text-destructive" />
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
