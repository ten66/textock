/*
  # Textock App Database Schema

  1. New Tables
    - `templates`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `content` (text, template content with variables)
      - `description` (text, optional description)
      - `category` (text, optional category)
      - `tags` (text array, for filtering)
      - `variables` (jsonb, extracted variable names and types)
      - `is_public` (boolean, sharing preference)
      - `user_id` (uuid, foreign key to auth.users)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `templates` table
    - Add policies for CRUD operations based on user authentication
    - Users can only access their own templates unless marked as public
*/

CREATE TABLE IF NOT EXISTS templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  description text DEFAULT '',
  category text DEFAULT 'General',
  tags text[] DEFAULT '{}',
  variables jsonb DEFAULT '[]',
  is_public boolean DEFAULT false,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

-- Policy for users to read their own templates
CREATE POLICY "Users can read own templates"
  ON templates
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy for users to read public templates
CREATE POLICY "Users can read public templates"
  ON templates
  FOR SELECT
  TO authenticated
  USING (is_public = true);

-- Policy for users to insert their own templates
CREATE POLICY "Users can insert own templates"
  ON templates
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy for users to update their own templates
CREATE POLICY "Users can update own templates"
  ON templates
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy for users to delete their own templates
CREATE POLICY "Users can delete own templates"
  ON templates
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_templates_updated_at
  BEFORE UPDATE ON templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();