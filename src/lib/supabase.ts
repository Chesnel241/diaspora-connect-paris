/**
 * Supabase Client Configuration
 *
 * This file initializes the Supabase client for the Diaspora Connect Paris application.
 * It uses environment variables for the Supabase URL and anonymous key.
 */

import { createClient } from '@supabase/supabase-js';

// Supabase configuration from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate that environment variables are set
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables!');
  console.error('Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env file');
}

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '', {
  auth: {
    persistSession: false, // We don't need session persistence for public registration
  },
});

/**
 * Database Types
 * These types match the schema defined in supabase-setup.sql
 */

export interface InscriptionData {
  id?: string;
  created_at?: string;
  updated_at?: string;

  // Section A: Personal Information
  full_name: string;
  email: string;
  phone_code: string;
  phone: string;
  country: string;
  city: string;

  // Section B: Accommodation
  needs_accommodation: boolean;
  start_date?: string | null;
  end_date?: string | null;

  // Section C: Family
  has_children: boolean;
  number_of_children?: number | null;
  children_ages?: string | null;

  // Section D: Accessibility
  has_reduced_mobility: boolean;
  has_special_needs: boolean;

  // Section E: Dietary
  allergies?: string | null;

  // Section F: Comments
  comments?: string | null;

  // Metadata
  status?: 'pending' | 'confirmed' | 'cancelled';
}

/**
 * Custom error class for Supabase operations
 */
export class SupabaseError extends Error {
  code?: string;
  details?: any;

  constructor(message: string, code?: string, details?: any) {
    super(message);
    this.name = 'SupabaseError';
    this.code = code;
    this.details = details;
  }
}

/**
 * Error handler that logs in development but not in production
 */
function handleError(error: any, context: string): SupabaseError {
  // Only log in development
  if (import.meta.env.DEV) {
    console.error(`[Supabase Error - ${context}]:`, error);
  }

  // Generic user-friendly message
  let userMessage = 'Une erreur est survenue. / An error occurred.';
  let errorCode = error?.code || 'UNKNOWN';

  // Map specific Supabase errors to user-friendly messages
  if (error?.code === '23505') {
    // Duplicate key violation
    userMessage = 'Cette inscription existe déjà. / This registration already exists.';
    errorCode = 'DUPLICATE_ENTRY';
  } else if (error?.code === '23503') {
    // Foreign key violation
    userMessage = 'Données invalides. / Invalid data.';
    errorCode = 'INVALID_DATA';
  } else if (error?.message?.includes('timeout')) {
    userMessage = 'Délai d\'attente dépassé. Veuillez réessayer. / Timeout. Please try again.';
    errorCode = 'TIMEOUT';
  } else if (error?.message?.includes('network')) {
    userMessage = 'Problème de connexion. Vérifiez votre internet. / Connection issue. Check your internet.';
    errorCode = 'NETWORK_ERROR';
  }

  return new SupabaseError(userMessage, errorCode, error);
}

/**
 * Insert a new inscription into the database
 * @param data The inscription data to insert
 * @returns The inserted inscription
 * @throws SupabaseError if insertion fails
 */
export async function insertInscription(data: Omit<InscriptionData, 'id' | 'created_at' | 'updated_at'>): Promise<InscriptionData> {
  try {
    const { data: inscription, error } = await supabase
      .from('inscriptions')
      .insert([data])
      .select()
      .single();

    if (error) {
      throw handleError(error, 'insertInscription');
    }

    if (!inscription) {
      throw new SupabaseError('Aucune donnée retournée / No data returned', 'NO_DATA');
    }

    return inscription as InscriptionData;
  } catch (error: any) {
    if (error instanceof SupabaseError) {
      throw error;
    }
    throw handleError(error, 'insertInscription');
  }
}

/**
 * Check if an email is already registered
 * @param email The email to check
 * @returns True if email exists, false otherwise
 * @throws SupabaseError if check fails
 */
export async function checkEmailExists(email: string): Promise<boolean> {
  try {
    // Validate email format before querying
    if (!email || typeof email !== 'string') {
      throw new SupabaseError('Email invalide / Invalid email', 'INVALID_EMAIL');
    }

    const { data, error } = await supabase
      .from('inscriptions')
      .select('id')
      .eq('email', email.toLowerCase())
      .limit(1);

    if (error) {
      throw handleError(error, 'checkEmailExists');
    }

    return data !== null && data.length > 0;
  } catch (error: any) {
    if (error instanceof SupabaseError) {
      throw error;
    }
    throw handleError(error, 'checkEmailExists');
  }
}

/**
 * Get inscription statistics (requires authentication)
 * @returns Statistics object
 */
export async function getInscriptionStats() {
  try {
    const { data, error } = await supabase
      .from('inscription_stats')
      .select('*')
      .single();

    if (error) {
      throw handleError(error, 'getInscriptionStats');
    }

    return data;
  } catch (error: any) {
    if (error instanceof SupabaseError) {
      throw error;
    }
    throw handleError(error, 'getInscriptionStats');
  }
}
