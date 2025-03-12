import { createClient } from '@supabase/supabase-js';

// These environment variables will need to be set in your .env.local file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database tables
export type Profile = {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  website: string | null;
  updated_at: string;
};

export type TimezoneConfig = {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  timezones: string[];
  blocked_hours: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
};

export type UserPreferences = {
  user_id: string;
  default_view: 'cards' | 'grid';
  default_blocked_hours: string;
  recent_timezones: string[] | null;
  updated_at: string;
};

// Helper functions for database operations
export async function saveTimezoneConfig(config: Omit<TimezoneConfig, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('timezone_configs')
    .insert(config)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function getUserTimezoneConfigs(userId: string) {
  const { data, error } = await supabase
    .from('timezone_configs')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

export async function getPublicTimezoneConfigs() {
  const { data, error } = await supabase
    .from('timezone_configs')
    .select('*')
    .eq('is_public', true)
    .order('updated_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

export async function updateUserPreferences(userId: string, preferences: Partial<Omit<UserPreferences, 'user_id' | 'updated_at'>>) {
  const { data, error } = await supabase
    .from('user_preferences')
    .update(preferences)
    .eq('user_id', userId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function getUserPreferences(userId: string) {
  const { data, error } = await supabase
    .from('user_preferences')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned"
  return data;
} 