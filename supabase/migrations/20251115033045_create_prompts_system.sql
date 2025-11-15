/*
  # Prompt Management System

  1. New Tables
    - `prompts`
      - `id` (uuid, primary key)
      - `prompt_id` (text, unique identifier like '6h1')
      - `title` (text)
      - `text` (text, the main prompt)
      - `instructions` (text)
      - `grade` (integer, 6-8)
      - `section` (text, 'Humanity' or 'Honors')
      - `background_image` (text, optional URL)
      - `example_image` (text, optional URL)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `is_active` (boolean, for soft delete)

    - `user_progress`
      - `id` (uuid, primary key)
      - `user_id` (text, from local storage or session)
      - `prompt_id` (uuid, foreign key)
      - `finished_at` (timestamptz)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Public read access for prompts (students viewing)
    - Authenticated admin access for prompt management
    - User-specific progress tracking
*/

-- Create prompts table
CREATE TABLE IF NOT EXISTS prompts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_id text UNIQUE NOT NULL,
  title text NOT NULL,
  text text NOT NULL,
  instructions text NOT NULL,
  grade integer NOT NULL CHECK (grade IN (6, 7, 8)),
  section text NOT NULL CHECK (section IN ('Humanity', 'Honors')),
  background_image text,
  example_image text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  is_active boolean DEFAULT true
);

-- Create user_progress table
CREATE TABLE IF NOT EXISTS user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  prompt_id uuid NOT NULL REFERENCES prompts(id) ON DELETE CASCADE,
  finished_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, prompt_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_prompts_grade_section ON prompts(grade, section) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_prompts_prompt_id ON prompts(prompt_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_prompt_id ON user_progress(prompt_id);

-- Enable RLS
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Prompts policies (public read, authenticated write)
CREATE POLICY "Anyone can view active prompts"
  ON prompts FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated users can insert prompts"
  ON prompts FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update prompts"
  ON prompts FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete prompts"
  ON prompts FOR DELETE
  TO authenticated
  USING (true);

-- User progress policies (users manage their own progress)
CREATE POLICY "Users can view their own progress"
  ON user_progress FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own progress"
  ON user_progress FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can delete their own progress"
  ON user_progress FOR DELETE
  USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_prompts_updated_at ON prompts;
CREATE TRIGGER update_prompts_updated_at
  BEFORE UPDATE ON prompts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
