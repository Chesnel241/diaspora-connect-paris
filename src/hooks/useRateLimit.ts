/**
 * Rate Limiting Hook
 *
 * Client-side rate limiting to prevent spam and abuse.
 * Tracks submission attempts and blocks if threshold is exceeded.
 */

import { useState, useEffect, useCallback } from 'react';

interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
  storageKey?: string;
}

interface RateLimitState {
  isBlocked: boolean;
  remainingAttempts: number;
  resetTime: number | null;
  canSubmit: boolean;
}

interface RateLimitReturn extends RateLimitState {
  recordAttempt: () => void;
  reset: () => void;
  getTimeUntilReset: () => number;
}

/**
 * Hook to implement client-side rate limiting
 */
export function useRateLimit(config: RateLimitConfig): RateLimitReturn {
  const {
    maxAttempts,
    windowMs,
    storageKey = 'registration_rate_limit',
  } = config;

  const [state, setState] = useState<RateLimitState>(() => {
    // Initialize from localStorage if available
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const now = Date.now();

        // Check if the window has expired
        if (parsed.resetTime && now < parsed.resetTime) {
          const remainingAttempts = maxAttempts - parsed.attempts;
          return {
            isBlocked: remainingAttempts <= 0,
            remainingAttempts: Math.max(0, remainingAttempts),
            resetTime: parsed.resetTime,
            canSubmit: remainingAttempts > 0,
          };
        }
      } catch (e) {
        // Invalid stored data, reset
        localStorage.removeItem(storageKey);
      }
    }

    return {
      isBlocked: false,
      remainingAttempts: maxAttempts,
      resetTime: null,
      canSubmit: true,
    };
  });

  /**
   * Record a submission attempt
   */
  const recordAttempt = useCallback(() => {
    const now = Date.now();
    const stored = localStorage.getItem(storageKey);
    let attempts = 1;
    let resetTime = now + windowMs;

    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.resetTime && now < parsed.resetTime) {
          attempts = (parsed.attempts || 0) + 1;
          resetTime = parsed.resetTime;
        }
      } catch (e) {
        // Invalid data, reset
      }
    }

    // Store updated attempts
    localStorage.setItem(
      storageKey,
      JSON.stringify({ attempts, resetTime })
    );

    const remainingAttempts = maxAttempts - attempts;
    setState({
      isBlocked: remainingAttempts <= 0,
      remainingAttempts: Math.max(0, remainingAttempts),
      resetTime,
      canSubmit: remainingAttempts > 0,
    });
  }, [maxAttempts, windowMs, storageKey]);

  /**
   * Reset the rate limit
   */
  const reset = useCallback(() => {
    localStorage.removeItem(storageKey);
    setState({
      isBlocked: false,
      remainingAttempts: maxAttempts,
      resetTime: null,
      canSubmit: true,
    });
  }, [maxAttempts, storageKey]);

  /**
   * Get time until reset in milliseconds
   */
  const getTimeUntilReset = useCallback((): number => {
    if (!state.resetTime) return 0;
    const now = Date.now();
    return Math.max(0, state.resetTime - now);
  }, [state.resetTime]);

  /**
   * Auto-reset when window expires
   */
  useEffect(() => {
    if (!state.resetTime) return;

    const timeUntilReset = getTimeUntilReset();
    if (timeUntilReset === 0) {
      reset();
      return;
    }

    const timer = setTimeout(() => {
      reset();
    }, timeUntilReset);

    return () => clearTimeout(timer);
  }, [state.resetTime, reset, getTimeUntilReset]);

  return {
    ...state,
    recordAttempt,
    reset,
    getTimeUntilReset,
  };
}

/**
 * Format remaining time for display
 */
export function formatTimeUntilReset(ms: number): string {
  const seconds = Math.ceil(ms / 1000);
  if (seconds < 60) {
    return `${seconds} seconde${seconds > 1 ? 's' : ''}`;
  }
  const minutes = Math.ceil(seconds / 60);
  return `${minutes} minute${minutes > 1 ? 's' : ''}`;
}
