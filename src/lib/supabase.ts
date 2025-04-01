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
  default_view: 'cards' | 'grid' | null;
  is_public: boolean;
  created_at: string;
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

export async function updateUserPreferences(userId: string, preferences: { default_view?: 'cards' | 'grid', default_blocked_hours?: string, recent_timezones?: string[] }) {
  const { data: existingConfig } = await supabase
    .from('timezone_configs')
    .select('*')
    .eq('user_id', userId)
    .eq('name', 'Last Used Configuration')
    .single();

  if (existingConfig) {
    const { data, error } = await supabase
      .from('timezone_configs')
      .update({
        default_view: preferences.default_view ?? existingConfig.default_view,
        blocked_hours: preferences.default_blocked_hours ?? existingConfig.blocked_hours,
        timezones: preferences.recent_timezones ?? existingConfig.timezones,
      })
      .eq('id', existingConfig.id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } else {
    const { data, error } = await supabase
      .from('timezone_configs')
      .insert({
        user_id: userId,
        name: 'Last Used Configuration',
        default_view: preferences.default_view,
        blocked_hours: preferences.default_blocked_hours,
        timezones: preferences.recent_timezones || [],
        is_public: false,
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
}

export async function getUserPreferences(userId: string) {
  const { data, error } = await supabase
    .from('timezone_configs')
    .select('*')
    .eq('user_id', userId)
    .eq('name', 'Last Used Configuration')
    .single();
  
  if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned"
  
  if (data) {
    return {
      user_id: data.user_id,
      default_view: data.default_view,
      default_blocked_hours: data.blocked_hours,
      recent_timezones: data.timezones,
      updated_at: data.updated_at,
    };
  }
  return null;
} 