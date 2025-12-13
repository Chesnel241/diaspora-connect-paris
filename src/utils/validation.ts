/**
 * Validation and Sanitization Utilities
 *
 * This module provides comprehensive validation and sanitization functions
 * to protect against XSS, injection attacks, and malformed data.
 */

import DOMPurify from 'dompurify';
import validator from 'validator';

/**
 * Security Configuration
 */
export const SECURITY_CONFIG = {
  // Maximum field lengths
  MAX_LENGTHS: {
    fullName: 100,
    email: 254, // RFC 5321
    phone: 20,
    country: 100,
    city: 100,
    childrenAges: 100,
    allergies: 500,
    comments: 1000,
  },

  // Rate limiting (client-side)
  RATE_LIMIT: {
    maxAttempts: 3,
    windowMs: 60000, // 1 minute
  },

  // Regex patterns
  PATTERNS: {
    // Allow letters, spaces, hyphens, apostrophes (for names)
    name: /^[a-zA-ZÀ-ÿ\s'-]+$/,
    // International phone numbers
    phone: /^[0-9\s\-\+\(\)]+$/,
    // Letters, spaces, hyphens (for countries/cities)
    location: /^[a-zA-ZÀ-ÿ\s'-]+$/,
    // Numbers and commas for ages
    ages: /^[0-9,\s]+$/,
  },
};

/**
 * Sanitize a string by removing HTML tags and trimming
 */
export function sanitizeString(input: string): string {
  if (!input) return '';

  // Remove HTML tags
  const cleaned = DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  });

  // Trim whitespace
  return cleaned.trim();
}

/**
 * Validate and sanitize full name
 */
export function validateFullName(name: string): { isValid: boolean; error?: string; sanitized: string } {
  const sanitized = sanitizeString(name);

  if (!sanitized) {
    return { isValid: false, error: 'Le nom est requis / Name is required', sanitized: '' };
  }

  if (sanitized.length > SECURITY_CONFIG.MAX_LENGTHS.fullName) {
    return {
      isValid: false,
      error: `Le nom ne doit pas dépasser ${SECURITY_CONFIG.MAX_LENGTHS.fullName} caractères / Name must not exceed ${SECURITY_CONFIG.MAX_LENGTHS.fullName} characters`,
      sanitized
    };
  }

  if (!SECURITY_CONFIG.PATTERNS.name.test(sanitized)) {
    return {
      isValid: false,
      error: 'Le nom contient des caractères invalides / Name contains invalid characters',
      sanitized
    };
  }

  return { isValid: true, sanitized };
}

/**
 * Validate and sanitize email
 */
export function validateEmail(email: string): { isValid: boolean; error?: string; sanitized: string } {
  const sanitized = sanitizeString(email).toLowerCase();

  if (!sanitized) {
    return { isValid: false, error: 'L\'email est requis / Email is required', sanitized: '' };
  }

  if (sanitized.length > SECURITY_CONFIG.MAX_LENGTHS.email) {
    return {
      isValid: false,
      error: `L'email ne doit pas dépasser ${SECURITY_CONFIG.MAX_LENGTHS.email} caractères / Email must not exceed ${SECURITY_CONFIG.MAX_LENGTHS.email} characters`,
      sanitized
    };
  }

  // Use validator library for robust email validation
  if (!validator.isEmail(sanitized)) {
    return {
      isValid: false,
      error: 'Format d\'email invalide / Invalid email format',
      sanitized
    };
  }

  // Additional check: no special characters that could be used for injection
  if (sanitized.includes('<') || sanitized.includes('>') || sanitized.includes('"')) {
    return {
      isValid: false,
      error: 'Email contient des caractères interdits / Email contains forbidden characters',
      sanitized
    };
  }

  return { isValid: true, sanitized };
}

/**
 * Validate and sanitize phone number
 */
export function validatePhone(phone: string): { isValid: boolean; error?: string; sanitized: string } {
  const sanitized = sanitizeString(phone);

  if (!sanitized) {
    return { isValid: false, error: 'Le téléphone est requis / Phone is required', sanitized: '' };
  }

  if (sanitized.length > SECURITY_CONFIG.MAX_LENGTHS.phone) {
    return {
      isValid: false,
      error: `Le téléphone ne doit pas dépasser ${SECURITY_CONFIG.MAX_LENGTHS.phone} caractères / Phone must not exceed ${SECURITY_CONFIG.MAX_LENGTHS.phone} characters`,
      sanitized
    };
  }

  if (!SECURITY_CONFIG.PATTERNS.phone.test(sanitized)) {
    return {
      isValid: false,
      error: 'Format de téléphone invalide / Invalid phone format',
      sanitized
    };
  }

  // Check minimum length (at least 6 digits)
  const digitsOnly = sanitized.replace(/\D/g, '');
  if (digitsOnly.length < 6) {
    return {
      isValid: false,
      error: 'Le numéro de téléphone est trop court / Phone number is too short',
      sanitized
    };
  }

  return { isValid: true, sanitized };
}

/**
 * Validate and sanitize country/city
 */
export function validateLocation(location: string, fieldName: string): { isValid: boolean; error?: string; sanitized: string } {
  const sanitized = sanitizeString(location);

  if (!sanitized) {
    return {
      isValid: false,
      error: `${fieldName} est requis / ${fieldName} is required`,
      sanitized: ''
    };
  }

  const maxLength = fieldName.toLowerCase().includes('country')
    ? SECURITY_CONFIG.MAX_LENGTHS.country
    : SECURITY_CONFIG.MAX_LENGTHS.city;

  if (sanitized.length > maxLength) {
    return {
      isValid: false,
      error: `${fieldName} ne doit pas dépasser ${maxLength} caractères / ${fieldName} must not exceed ${maxLength} characters`,
      sanitized
    };
  }

  if (!SECURITY_CONFIG.PATTERNS.location.test(sanitized)) {
    return {
      isValid: false,
      error: `${fieldName} contient des caractères invalides / ${fieldName} contains invalid characters`,
      sanitized
    };
  }

  return { isValid: true, sanitized };
}

/**
 * Validate and sanitize children ages
 */
export function validateChildrenAges(ages: string): { isValid: boolean; error?: string; sanitized: string } {
  const sanitized = sanitizeString(ages);

  if (!sanitized) {
    return { isValid: true, sanitized: '' }; // Optional field
  }

  if (sanitized.length > SECURITY_CONFIG.MAX_LENGTHS.childrenAges) {
    return {
      isValid: false,
      error: `Les âges ne doivent pas dépasser ${SECURITY_CONFIG.MAX_LENGTHS.childrenAges} caractères / Ages must not exceed ${SECURITY_CONFIG.MAX_LENGTHS.childrenAges} characters`,
      sanitized
    };
  }

  if (!SECURITY_CONFIG.PATTERNS.ages.test(sanitized)) {
    return {
      isValid: false,
      error: 'Format d\'âges invalide (utilisez des chiffres séparés par des virgules) / Invalid ages format (use numbers separated by commas)',
      sanitized
    };
  }

  return { isValid: true, sanitized };
}

/**
 * Validate and sanitize text fields (allergies, comments)
 */
export function validateTextField(text: string, fieldName: string, maxLength: number): { isValid: boolean; error?: string; sanitized: string } {
  const sanitized = sanitizeString(text);

  if (!sanitized) {
    return { isValid: true, sanitized: '' }; // Optional fields
  }

  if (sanitized.length > maxLength) {
    return {
      isValid: false,
      error: `${fieldName} ne doit pas dépasser ${maxLength} caractères / ${fieldName} must not exceed ${maxLength} characters`,
      sanitized
    };
  }

  return { isValid: true, sanitized };
}

/**
 * Validate number of children
 */
export function validateNumberOfChildren(num: string): { isValid: boolean; error?: string; sanitized: number | null } {
  if (!num) {
    return { isValid: true, sanitized: null };
  }

  const parsed = parseInt(num, 10);

  if (isNaN(parsed) || parsed < 0 || parsed > 20) {
    return {
      isValid: false,
      error: 'Nombre d\'enfants invalide (0-20) / Invalid number of children (0-20)',
      sanitized: null
    };
  }

  return { isValid: true, sanitized: parsed };
}

/**
 * Validate dates
 */
export function validateDates(startDate: string, endDate: string): { isValid: boolean; error?: string } {
  if (!startDate || !endDate) {
    return { isValid: true }; // Optional
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return {
      isValid: false,
      error: 'Format de date invalide / Invalid date format'
    };
  }

  if (end < start) {
    return {
      isValid: false,
      error: 'La date de départ doit être après la date d\'arrivée / End date must be after start date'
    };
  }

  // Check dates are not too far in the past or future (within 2 years)
  const now = new Date();
  const twoYearsAgo = new Date(now.getFullYear() - 2, now.getMonth(), now.getDate());
  const twoYearsAhead = new Date(now.getFullYear() + 2, now.getMonth(), now.getDate());

  if (start < twoYearsAgo || start > twoYearsAhead) {
    return {
      isValid: false,
      error: 'La date d\'arrivée doit être dans une période raisonnable / Start date must be within a reasonable timeframe'
    };
  }

  return { isValid: true };
}

/**
 * Comprehensive form validation
 */
export interface FormValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  sanitizedData: Record<string, any>;
}

export function validateFormData(formData: any): FormValidationResult {
  const errors: Record<string, string> = {};
  const sanitizedData: Record<string, any> = {};

  // Validate and sanitize full name
  const nameResult = validateFullName(formData.fullName || '');
  if (!nameResult.isValid) errors.fullName = nameResult.error!;
  sanitizedData.fullName = nameResult.sanitized;

  // Validate and sanitize email
  const emailResult = validateEmail(formData.email || '');
  if (!emailResult.isValid) errors.email = emailResult.error!;
  sanitizedData.email = emailResult.sanitized;

  // Validate and sanitize phone
  const phoneResult = validatePhone(formData.phone || '');
  if (!phoneResult.isValid) errors.phone = phoneResult.error!;
  sanitizedData.phone = phoneResult.sanitized;

  // Validate and sanitize country
  const countryResult = validateLocation(formData.country || '', 'Pays / Country');
  if (!countryResult.isValid) errors.country = countryResult.error!;
  sanitizedData.country = countryResult.sanitized;

  // Validate and sanitize city
  const cityResult = validateLocation(formData.city || '', 'Ville / City');
  if (!cityResult.isValid) errors.city = cityResult.error!;
  sanitizedData.city = cityResult.sanitized;

  // Validate dates
  if (formData.needsAccommodation) {
    const datesResult = validateDates(formData.startDate, formData.endDate);
    if (!datesResult.isValid) errors.dates = datesResult.error!;
  }

  // Validate number of children
  if (formData.hasChildren && formData.numberOfChildren) {
    const childrenNumResult = validateNumberOfChildren(formData.numberOfChildren);
    if (!childrenNumResult.isValid) errors.numberOfChildren = childrenNumResult.error!;
    sanitizedData.numberOfChildren = childrenNumResult.sanitized;
  }

  // Validate children ages
  if (formData.hasChildren && formData.childrenAges) {
    const agesResult = validateChildrenAges(formData.childrenAges);
    if (!agesResult.isValid) errors.childrenAges = agesResult.error!;
    sanitizedData.childrenAges = agesResult.sanitized;
  }

  // Validate allergies
  const allergiesResult = validateTextField(
    formData.allergies || '',
    'Allergies',
    SECURITY_CONFIG.MAX_LENGTHS.allergies
  );
  if (!allergiesResult.isValid) errors.allergies = allergiesResult.error!;
  sanitizedData.allergies = allergiesResult.sanitized;

  // Validate comments
  const commentsResult = validateTextField(
    formData.comments || '',
    'Commentaires / Comments',
    SECURITY_CONFIG.MAX_LENGTHS.comments
  );
  if (!commentsResult.isValid) errors.comments = commentsResult.error!;
  sanitizedData.comments = commentsResult.sanitized;

  // Copy other fields
  sanitizedData.phoneCode = formData.phoneCode;
  sanitizedData.needsAccommodation = Boolean(formData.needsAccommodation);
  sanitizedData.startDate = formData.startDate || '';
  sanitizedData.endDate = formData.endDate || '';
  sanitizedData.hasChildren = Boolean(formData.hasChildren);
  sanitizedData.hasReducedMobility = Boolean(formData.hasReducedMobility);
  sanitizedData.hasSpecialNeeds = Boolean(formData.hasSpecialNeeds);

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitizedData,
  };
}
