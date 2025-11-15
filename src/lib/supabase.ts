import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface DbPrompt {
  id: string;
  prompt_id: string;
  title: string;
  text: string;
  instructions: string;
  grade: 6 | 7 | 8;
  section: 'Humanity' | 'Honors';
  background_image?: string;
  example_image?: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface DbUserProgress {
  id: string;
  user_id: string;
  prompt_id: string;
  finished_at: string;
  created_at: string;
}
