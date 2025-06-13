-- Create a table for user profiles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  website TEXT,
  
  CONSTRAINT username_length CHECK (char_length(username) >= 3)
);

-- Create a table for saved timezone configurations
CREATE TABLE IF NOT EXISTS timezone_configs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  timezones TEXT[] NOT NULL,
  blocked_hours TEXT,
  default_view TEXT DEFAULT 'cards',
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create a table for user preferences
CREATE TABLE IF NOT EXISTS user_preferences (
  user_id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  default_view TEXT DEFAULT 'cards',
  default_blocked_hours TEXT DEFAULT '22-6',
  recent_timezones TEXT[],
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Set up Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE timezone_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Public profiles are viewable by everyone
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Public timezone configs are viewable by everyone
CREATE POLICY "Public timezone configs are viewable by everyone" ON timezone_configs
  FOR SELECT USING (is_public = true OR auth.uid() = user_id);

-- Users can insert their own timezone configs
CREATE POLICY "Users can insert their own timezone configs" ON timezone_configs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own timezone configs
CREATE POLICY "Users can update their own timezone configs" ON timezone_configs
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own timezone configs
CREATE POLICY "Users can delete their own timezone configs" ON timezone_configs
  FOR DELETE USING (auth.uid() = user_id);

-- User preferences are only viewable by the user
CREATE POLICY "User preferences are only viewable by the user" ON user_preferences
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own preferences
CREATE POLICY "Users can insert their own preferences" ON user_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own preferences
CREATE POLICY "Users can update their own preferences" ON user_preferences
  FOR UPDATE USING (auth.uid() = user_id);

-- Create functions and triggers
-- Function to handle user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create user profile
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  
  -- Create user preferences with defaults
  INSERT INTO public.user_preferences (user_id)
  VALUES (new.id);
  
  -- Create default timezone configuration with empty timezones
  INSERT INTO public.timezone_configs (user_id, name, timezones)
  VALUES (new.id, 'Last Used Configuration', ARRAY[]::text[]);
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user(); 