import { supabase, DbPrompt } from './supabase';
import { journalPrompts } from '@/data/prompts';

export interface JournalPrompt {
  id: string;
  title: string;
  text: string;
  instructions: string;
  grade: 6 | 7 | 8;
  section: 'Humanity' | 'Honors';
  backgroundImage?: string;
  exampleImage?: string;
}

const dbPromptToJournalPrompt = (dbPrompt: DbPrompt): JournalPrompt => ({
  id: dbPrompt.prompt_id,
  title: dbPrompt.title,
  text: dbPrompt.text,
  instructions: dbPrompt.instructions,
  grade: dbPrompt.grade,
  section: dbPrompt.section,
  backgroundImage: dbPrompt.background_image || undefined,
  exampleImage: dbPrompt.example_image || undefined,
});

export const getPromptsByGradeAndSection = async (
  grade: 6 | 7 | 8,
  section: 'Humanity' | 'Honors'
): Promise<JournalPrompt[]> => {
  try {
    const { data, error } = await supabase
      .from('prompts')
      .select('*')
      .eq('grade', grade)
      .eq('section', section)
      .eq('is_active', true)
      .order('created_at', { ascending: true });

    if (error) throw error;

    if (data && data.length > 0) {
      return data.map(dbPromptToJournalPrompt);
    }

    return journalPrompts.filter(p => p.grade === grade && p.section === section);
  } catch (error) {
    console.error('Error fetching prompts from database, using fallback:', error);
    return journalPrompts.filter(p => p.grade === grade && p.section === section);
  }
};

export const getPromptById = async (id: string): Promise<JournalPrompt | null> => {
  try {
    const { data, error } = await supabase
      .from('prompts')
      .select('*')
      .eq('prompt_id', id)
      .eq('is_active', true)
      .maybeSingle();

    if (error) throw error;

    if (data) {
      return dbPromptToJournalPrompt(data);
    }

    const localPrompt = journalPrompts.find(p => p.id === id);
    return localPrompt || null;
  } catch (error) {
    console.error('Error fetching prompt from database, using fallback:', error);
    const localPrompt = journalPrompts.find(p => p.id === id);
    return localPrompt || null;
  }
};

const getUserId = (): string => {
  let userId = localStorage.getItem('user_id');
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('user_id', userId);
  }
  return userId;
};

export const markPromptAsFinished = async (promptId: string): Promise<void> => {
  try {
    const userId = getUserId();

    const { data: prompt } = await supabase
      .from('prompts')
      .select('id')
      .eq('prompt_id', promptId)
      .eq('is_active', true)
      .maybeSingle();

    if (prompt) {
      const { error } = await supabase
        .from('user_progress')
        .insert([{ user_id: userId, prompt_id: prompt.id }]);

      if (error && error.code !== '23505') {
        throw error;
      }
    }
  } catch (error) {
    console.error('Error marking prompt as finished:', error);
  }
};

export const unmarkPromptAsFinished = async (promptId: string): Promise<void> => {
  try {
    const userId = getUserId();

    const { data: prompt } = await supabase
      .from('prompts')
      .select('id')
      .eq('prompt_id', promptId)
      .eq('is_active', true)
      .maybeSingle();

    if (prompt) {
      await supabase
        .from('user_progress')
        .delete()
        .eq('user_id', userId)
        .eq('prompt_id', prompt.id);
    }
  } catch (error) {
    console.error('Error unmarking prompt:', error);
  }
};

export const isPromptFinished = async (promptId: string): Promise<boolean> => {
  try {
    const userId = getUserId();

    const { data: prompt } = await supabase
      .from('prompts')
      .select('id')
      .eq('prompt_id', promptId)
      .eq('is_active', true)
      .maybeSingle();

    if (!prompt) return false;

    const { data, error } = await supabase
      .from('user_progress')
      .select('id')
      .eq('user_id', userId)
      .eq('prompt_id', prompt.id)
      .maybeSingle();

    if (error) throw error;

    return !!data;
  } catch (error) {
    console.error('Error checking if prompt is finished:', error);
    return false;
  }
};

export const getFinishedPromptIds = async (
  grade: 6 | 7 | 8,
  section: 'Humanity' | 'Honors'
): Promise<Set<string>> => {
  try {
    const userId = getUserId();

    const { data: prompts } = await supabase
      .from('prompts')
      .select('id, prompt_id')
      .eq('grade', grade)
      .eq('section', section)
      .eq('is_active', true);

    if (!prompts || prompts.length === 0) return new Set();

    const promptIds = prompts.map(p => p.id);

    const { data: progress } = await supabase
      .from('user_progress')
      .select('prompt_id')
      .eq('user_id', userId)
      .in('prompt_id', promptIds);

    if (!progress) return new Set();

    const finishedPromptUuids = new Set(progress.map(p => p.prompt_id));
    const finishedPromptIds = prompts
      .filter(p => finishedPromptUuids.has(p.id))
      .map(p => p.prompt_id);

    return new Set(finishedPromptIds);
  } catch (error) {
    console.error('Error getting finished prompts:', error);
    return new Set();
  }
};
