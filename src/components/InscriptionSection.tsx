import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  User, Mail, Phone, Globe, MapPin, Home, Baby,
  UtensilsCrossed, MessageSquare, Check, Loader2, Accessibility, Shield
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import { insertInscription, checkEmailExists, SupabaseError } from '@/lib/supabase';
import type { InscriptionData } from '@/lib/supabase';
import { validateFormData, SECURITY_CONFIG } from '@/utils/validation';
import { useRateLimit, formatTimeUntilReset } from '@/hooks/useRateLimit';
import { ReCaptcha, useReCaptchaEnabled } from '@/components/ReCaptcha';
import type ReCAPTCHA from 'react-google-recaptcha';

interface FormData {
  fullName: string;
  email: string;
  phoneCode: string;
  phone: string;
  country: string;
  city: string;
  needsAccommodation: boolean;
  startDate: string;
  endDate: string;
  hasChildren: boolean;
  numberOfChildren: string;
  childrenAges: string;
  hasReducedMobility: boolean;
  hasSpecialNeeds: boolean;
  allergies: string;
  comments: string;
}

const phoneCodes = [
  { code: '+33', country: 'FR' },
  { code: '+1', country: 'US' },
  { code: '+44', country: 'UK' },
  { code: '+49', country: 'DE' },
  { code: '+32', country: 'BE' },
  { code: '+41', country: 'CH' },
  { code: '+39', country: 'IT' },
  { code: '+34', country: 'ES' },
  { code: '+237', country: 'CM' },
  { code: '+225', country: 'CI' },
  { code: '+221', country: 'SN' },
  { code: '+229', country: 'BJ' },
  { code: '+228', country: 'TG' },
];

const InscriptionSection = () => {
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const isReCaptchaEnabled = useReCaptchaEnabled();

  // Rate limiting hook
  const rateLimit = useRateLimit({
    maxAttempts: SECURITY_CONFIG.RATE_LIMIT.maxAttempts,
    windowMs: SECURITY_CONFIG.RATE_LIMIT.windowMs,
  });

  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phoneCode: '+33',
    phone: '',
    country: '',
    city: '',
    needsAccommodation: false,
    startDate: '',
    endDate: '',
    hasChildren: false,
    numberOfChildren: '',
    childrenAges: '',
    hasReducedMobility: false,
    hasSpecialNeeds: false,
    allergies: '',
    comments: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check rate limiting
    if (rateLimit.isBlocked) {
      const timeRemaining = formatTimeUntilReset(rateLimit.getTimeUntilReset());
      toast.error('Trop de tentatives / Too many attempts', {
        description: `Veuillez réessayer dans ${timeRemaining} / Please try again in ${timeRemaining}`,
      });
      return;
    }

    // Check reCAPTCHA if enabled
    if (isReCaptchaEnabled && !recaptchaToken) {
      toast.error(t('register_error_title'), {
        description: 'Veuillez compléter le reCAPTCHA / Please complete the reCAPTCHA',
      });
      return;
    }

    // Validate and sanitize form data
    const validation = validateFormData(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      toast.error(t('register_error_title'), {
        description: 'Veuillez corriger les erreurs dans le formulaire / Please correct the errors in the form',
      });
      return;
    }

    setIsSubmitting(true);
    rateLimit.recordAttempt();

    try {
      // Check if email already exists
      const emailExists = await checkEmailExists(validation.sanitizedData.email);
      if (emailExists) {
        toast.error(t('register_error_title'), {
          description: 'Cette adresse email est déjà enregistrée. / This email is already registered.',
        });
        setIsSubmitting(false);
        return;
      }

      // Prepare data for Supabase (using sanitized data)
      const inscriptionData: Omit<InscriptionData, 'id' | 'created_at' | 'updated_at'> = {
        full_name: validation.sanitizedData.fullName,
        email: validation.sanitizedData.email,
        phone_code: validation.sanitizedData.phoneCode,
        phone: validation.sanitizedData.phone,
        country: validation.sanitizedData.country,
        city: validation.sanitizedData.city,
        needs_accommodation: validation.sanitizedData.needsAccommodation,
        start_date: validation.sanitizedData.startDate || null,
        end_date: validation.sanitizedData.endDate || null,
        has_children: validation.sanitizedData.hasChildren,
        number_of_children: validation.sanitizedData.numberOfChildren || null,
        children_ages: validation.sanitizedData.childrenAges || null,
        has_reduced_mobility: validation.sanitizedData.hasReducedMobility,
        has_special_needs: validation.sanitizedData.hasSpecialNeeds,
        allergies: validation.sanitizedData.allergies || null,
        comments: validation.sanitizedData.comments || null,
        status: 'pending',
      };

      // Insert into Supabase
      await insertInscription(inscriptionData);

      setIsSubmitting(false);
      setIsSuccess(true);
      toast.success(t('register_success_title'), {
        description: t('register_success_message'),
      });

      // Reset reCAPTCHA
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
        setRecaptchaToken(null);
      }

      // Reset form after 2 seconds
      setTimeout(() => {
        setIsSuccess(false);
        setFormData({
          fullName: '',
          email: '',
          phoneCode: '+33',
          phone: '',
          country: '',
          city: '',
          needsAccommodation: false,
          startDate: '',
          endDate: '',
          hasChildren: false,
          numberOfChildren: '',
          childrenAges: '',
          hasReducedMobility: false,
          hasSpecialNeeds: false,
          allergies: '',
          comments: '',
        });
        setErrors({});
      }, 2000);
    } catch (error: any) {
      setIsSubmitting(false);

      // Reset reCAPTCHA on error
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
        setRecaptchaToken(null);
      }

      // Handle SupabaseError with user-friendly message
      if (error instanceof SupabaseError) {
        toast.error(t('register_error_title'), {
          description: error.message,
        });
      } else {
        toast.error(t('register_error_title'), {
          description: 'Une erreur est survenue. Veuillez réessayer. / An error occurred. Please try again.',
        });
      }
    }
  };

  const handleChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const inputClasses = (field: keyof FormData) =>
    `w-full px-4 py-3 pl-12 rounded-xl border-2 transition-all duration-200 bg-card text-foreground ${
      errors[field]
        ? 'border-destructive focus:border-destructive'
        : 'border-border focus:border-navy'
    } focus:outline-none focus:ring-2 focus:ring-navy/20`;

  return (
    <section id="register" className="section-padding bg-secondary">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            {t('register_title')}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t('register_subtitle')}
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-card rounded-3xl p-6 md:p-10 shadow-xl border border-border"
        >
          {/* Personal Information */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
              <User className="h-5 w-5 text-navy" />
              {t('register_personal')}
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t('register_fullname')} *
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={e => handleChange('fullName', e.target.value)}
                    placeholder={t('register_fullname_placeholder')}
                    className={inputClasses('fullName')}
                  />
                </div>
                {errors.fullName && <p className="text-destructive text-sm mt-1">{errors.fullName}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t('register_email')} *
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => handleChange('email', e.target.value)}
                    placeholder={t('register_email_placeholder')}
                    className={inputClasses('email')}
                  />
                </div>
                {errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t('register_phone')} *
                </label>
                <div className="flex gap-2">
                  <select
                    value={formData.phoneCode}
                    onChange={e => handleChange('phoneCode', e.target.value)}
                    className="px-3 py-3 rounded-xl border-2 border-border bg-card text-foreground focus:border-navy focus:outline-none"
                  >
                    {phoneCodes.map(({ code, country }) => (
                      <option key={code} value={code}>
                        {code} ({country})
                      </option>
                    ))}
                  </select>
                  <div className="relative flex-1">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={e => handleChange('phone', e.target.value)}
                      placeholder={t('register_phone_placeholder')}
                      className={inputClasses('phone')}
                    />
                  </div>
                </div>
                {errors.phone && <p className="text-destructive text-sm mt-1">{errors.phone}</p>}
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t('register_country')} *
                </label>
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={formData.country}
                    onChange={e => handleChange('country', e.target.value)}
                    placeholder={t('register_country_placeholder')}
                    className={inputClasses('country')}
                  />
                </div>
                {errors.country && <p className="text-destructive text-sm mt-1">{errors.country}</p>}
              </div>

              {/* City */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t('register_city')} *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={formData.city}
                    onChange={e => handleChange('city', e.target.value)}
                    placeholder={t('register_city_placeholder')}
                    className={inputClasses('city')}
                  />
                </div>
                {errors.city && <p className="text-destructive text-sm mt-1">{errors.city}</p>}
              </div>
            </div>
          </div>

          {/* Accommodation */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Home className="h-5 w-5 text-navy" />
              {t('register_accommodation')}
            </h3>

            <label className="flex items-center gap-3 cursor-pointer mb-4">
              <input
                type="checkbox"
                checked={formData.needsAccommodation}
                onChange={e => handleChange('needsAccommodation', e.target.checked)}
                className="w-5 h-5 rounded border-2 border-border text-navy focus:ring-navy"
              />
              <span className="text-foreground">{t('register_need_accommodation')}</span>
            </label>

            {formData.needsAccommodation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="grid md:grid-cols-2 gap-4 pl-8"
              >
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t('register_arrival_date')}
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={e => handleChange('startDate', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-border bg-card text-foreground focus:border-navy focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t('register_departure_date')}
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={e => handleChange('endDate', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-border bg-card text-foreground focus:border-navy focus:outline-none"
                  />
                </div>
              </motion.div>
            )}
          </div>

          {/* Family */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Baby className="h-5 w-5 text-navy" />
              {t('register_family')}
            </h3>

            <label className="flex items-center gap-3 cursor-pointer mb-4">
              <input
                type="checkbox"
                checked={formData.hasChildren}
                onChange={e => handleChange('hasChildren', e.target.checked)}
                className="w-5 h-5 rounded border-2 border-border text-navy focus:ring-navy"
              />
              <span className="text-foreground">{t('register_with_children')}</span>
            </label>

            {formData.hasChildren && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="grid md:grid-cols-2 gap-4 pl-8"
              >
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t('register_children_count')}
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.numberOfChildren}
                    onChange={e => handleChange('numberOfChildren', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-border bg-card text-foreground focus:border-navy focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t('register_children_ages')}
                  </label>
                  <input
                    type="text"
                    value={formData.childrenAges}
                    onChange={e => handleChange('childrenAges', e.target.value)}
                    placeholder={t('register_children_ages_placeholder')}
                    className="w-full px-4 py-3 rounded-xl border-2 border-border bg-card text-foreground focus:border-navy focus:outline-none"
                  />
                </div>
              </motion.div>
            )}
          </div>

          {/* Accessibility */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Accessibility className="h-5 w-5 text-navy" />
              {t('register_accessibility')}
            </h3>

            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.hasReducedMobility}
                  onChange={e => handleChange('hasReducedMobility', e.target.checked)}
                  className="w-5 h-5 rounded border-2 border-border text-navy focus:ring-navy"
                />
                <span className="text-foreground">{t('register_reduced_mobility')}</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.hasSpecialNeeds}
                  onChange={e => handleChange('hasSpecialNeeds', e.target.checked)}
                  className="w-5 h-5 rounded border-2 border-border text-navy focus:ring-navy"
                />
                <span className="text-foreground">{t('register_special_needs')}</span>
              </label>
            </div>
          </div>

          {/* Dietary */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <UtensilsCrossed className="h-5 w-5 text-navy" />
              {t('register_dietary')}
            </h3>

            <textarea
              value={formData.allergies}
              onChange={e => handleChange('allergies', e.target.value)}
              placeholder={t('register_allergies_placeholder')}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border-2 border-border bg-card text-foreground focus:border-navy focus:outline-none resize-none"
            />
          </div>

          {/* Comments */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-navy" />
              {t('register_comments')}
            </h3>

            <textarea
              value={formData.comments}
              onChange={e => handleChange('comments', e.target.value)}
              placeholder={t('register_comments_placeholder')}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border-2 border-border bg-card text-foreground focus:border-navy focus:outline-none resize-none"
            />
          </div>

          {/* reCAPTCHA */}
          <div className="mb-6 flex justify-center">
            <ReCaptcha
              ref={recaptchaRef}
              onChange={(token) => setRecaptchaToken(token)}
              onExpired={() => setRecaptchaToken(null)}
              onErrored={() => setRecaptchaToken(null)}
            />
          </div>

          {/* Rate Limit Warning */}
          {rateLimit.isBlocked && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl"
            >
              <div className="flex items-center gap-2 text-red-800">
                <Shield className="h-5 w-5" />
                <span className="text-sm font-medium">
                  Trop de tentatives. Réessayez dans {formatTimeUntilReset(rateLimit.getTimeUntilReset())} /
                  Too many attempts. Try again in {formatTimeUntilReset(rateLimit.getTimeUntilReset())}
                </span>
              </div>
            </motion.div>
          )}

          {/* Rate Limit Info */}
          {!rateLimit.isBlocked && rateLimit.remainingAttempts < SECURITY_CONFIG.RATE_LIMIT.maxAttempts && (
            <div className="mb-4 text-center text-sm text-muted-foreground">
              <Shield className="inline h-4 w-4 mr-1" />
              {rateLimit.remainingAttempts} tentative{rateLimit.remainingAttempts > 1 ? 's' : ''} restante{rateLimit.remainingAttempts > 1 ? 's' : ''} /
              {rateLimit.remainingAttempts} attempt{rateLimit.remainingAttempts > 1 ? 's' : ''} remaining
            </div>
          )}

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isSubmitting || isSuccess || rateLimit.isBlocked || (isReCaptchaEnabled && !recaptchaToken)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-3 transition-all duration-300 ${
              isSuccess
                ? 'bg-emerald text-emerald-foreground'
                : 'gradient-emerald text-primary-foreground hover:shadow-lg glow-emerald'
            } disabled:opacity-70 disabled:cursor-not-allowed`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                {t('register_submitting')}
              </>
            ) : isSuccess ? (
              <>
                <Check className="h-5 w-5" />
                {t('register_success_title')}
              </>
            ) : (
              t('register_submit')
            )}
          </motion.button>
        </motion.form>
      </div>
    </section>
  );
};

export default InscriptionSection;
