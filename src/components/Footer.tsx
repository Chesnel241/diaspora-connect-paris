import { motion } from 'framer-motion';
import { Mail, Phone, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import logo from '@/assets/logo.png';

const Footer = () => {
  const { t } = useLanguage();

  const organizations = [
    t('about_org1'),
    t('about_org2'),
    t('about_org3'),
  ];

  return (
    <footer className="bg-navy text-primary-foreground py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Logo & Org */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-6">
              <img src={logo} alt="Diaspora 2026" className="h-14 w-14" />
              <div>
                <p className="font-bold text-xl">DIASPORA 2026</p>
                <p className="text-sm text-primary-foreground/70">Paris • Juillet 2026</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-primary-foreground/70 mb-4">
                {t('footer_organized_by')}
              </h4>
              <ul className="space-y-2">
                {organizations.map((org, i) => (
                  <li key={i} className="text-primary-foreground/80 text-sm">
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
            <h4 className="text-sm font-semibold uppercase tracking-wider text-primary-foreground/70 mb-6">
              {t('footer_contact')}
            </h4>

            <div className="space-y-4">
              <a
                href="mailto:sfdrm.lwm@gmail.com"
                className="flex items-center gap-3 text-primary-foreground/80 hover:text-gold transition-colors"
              >
                <Mail className="h-5 w-5" />
                sfdrm.lwm@gmail.com
              </a>

              <a
                href="tel:+33676565157"
                className="flex items-center gap-3 text-primary-foreground/80 hover:text-gold transition-colors"
              >
                <Phone className="h-5 w-5" />
                +33 6 76 56 51 57
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
            <h4 className="text-sm font-semibold uppercase tracking-wider text-primary-foreground/70 mb-6">
              {t('footer_follow')}
            </h4>

            <motion.a
              href="https://linktr.ee/diaspora_life_word_mission"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
            >
              <ExternalLink className="h-5 w-5" />
              Linktree
            </motion.a>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="border-t border-primary-foreground/10 pt-8">
          <p className="text-center text-sm text-primary-foreground/60">
            © 2026 Diaspora Life Word Mission. {t('footer_rights')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
