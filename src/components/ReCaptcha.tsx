/**
 * ReCAPTCHA Component
 *
 * Wrapper for Google reCAPTCHA v2 with graceful degradation
 * if the API key is not configured.
 */

import { forwardRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

interface ReCaptchaProps {
  onChange: (token: string | null) => void;
  onErrored?: () => void;
  onExpired?: () => void;
  theme?: 'light' | 'dark';
  size?: 'normal' | 'compact';
}

/**
 * ReCAPTCHA component with optional rendering
 */
export const ReCaptcha = forwardRef<ReCAPTCHA, ReCaptchaProps>(
  ({ onChange, onErrored, onExpired, theme = 'light', size = 'normal' }, ref) => {
    const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

    // If no site key is configured, don't render anything
    if (!siteKey) {
      // In development, show a warning
      if (import.meta.env.DEV) {
        return (
          <div className="p-3 bg-yellow-100 border border-yellow-400 rounded-lg text-sm text-yellow-800">
            ⚠️ reCAPTCHA n'est pas configuré. Ajoutez VITE_RECAPTCHA_SITE_KEY dans .env
          </div>
        );
      }
      return null;
    }

    return (
      <ReCAPTCHA
        ref={ref}
        sitekey={siteKey}
        onChange={onChange}
        onErrored={onErrored}
        onExpired={onExpired}
        theme={theme}
        size={size}
      />
    );
  }
);

ReCaptcha.displayName = 'ReCaptcha';

/**
 * Hook to check if reCAPTCHA is enabled
 */
export function useReCaptchaEnabled(): boolean {
  return Boolean(import.meta.env.VITE_RECAPTCHA_SITE_KEY);
}
