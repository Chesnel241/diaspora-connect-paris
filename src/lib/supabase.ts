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
 * Insert a new inscription into the database
 * @param data The inscription data to insert
 * @returns The inserted inscription or null if error
 */
export async function insertInscription(data: Omit<InscriptionData, 'id' | 'created_at' | 'updated_at'>) {
  const { data: inscription, error } = await supabase
    .from('inscriptions')
    .insert([data])
    .select()
    .single();

  if (error) {
    console.error('Error inserting inscription:', error);
    throw error;
  }

  return inscription;
}

/**
 * Check if an error is a duplicate email error
 * @param error The Supabase error object
 * @returns True if it's a duplicate email error
 */
export function isDuplicateEmailError(error: unknown): boolean {
  if (error && typeof error === 'object' && 'code' in error) {
    // PostgreSQL unique violation error code
    return (error as { code: string }).code === '23505';
  }
  return false;
}
