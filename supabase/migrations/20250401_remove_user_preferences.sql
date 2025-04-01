-- Drop policies first
DROP POLICY IF EXISTS "User preferences are only viewable by the user" ON user_preferences;
DROP POLICY IF EXISTS "Users can insert their own preferences" ON user_preferences;
DROP POLICY IF EXISTS "Users can update their own preferences" ON user_preferences;

-- Then drop the table
DROP TABLE IF EXISTS user_preferences;