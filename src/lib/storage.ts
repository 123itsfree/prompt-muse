// Local storage utilities for persisting finished prompts

const FINISHED_PROMPTS_KEY = 'finished_prompts';
const AUTH_KEY = 'journal_auth';

export interface FinishedPrompt {
  promptId: string;
  grade: 6 | 7 | 8;
  section: 'Humanity' | 'Honors';
  finishedAt: string;
}

// Authentication
export const checkAuth = (): boolean => {
  return localStorage.getItem(AUTH_KEY) === 'true';
};

export const setAuth = (isAuthenticated: boolean): void => {
  if (isAuthenticated) {
    localStorage.setItem(AUTH_KEY, 'true');
  } else {
    localStorage.removeItem(AUTH_KEY);
  }
};

// Finished prompts management
export const getFinishedPrompts = (): FinishedPrompt[] => {
  const stored = localStorage.getItem(FINISHED_PROMPTS_KEY);
  if (!stored) return [];
  
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
};

export const isPromptFinished = (promptId: string): boolean => {
  const finished = getFinishedPrompts();
  return finished.some(fp => fp.promptId === promptId);
};

export const markPromptFinished = (
  promptId: string,
  grade: 6 | 7 | 8,
  section: 'Humanity' | 'Honors'
): void => {
  const finished = getFinishedPrompts();
  
  // Don't add if already finished
  if (finished.some(fp => fp.promptId === promptId)) return;
  
  finished.push({
    promptId,
    grade,
    section,
    finishedAt: new Date().toISOString(),
  });
  
  localStorage.setItem(FINISHED_PROMPTS_KEY, JSON.stringify(finished));
};

export const unmarkPromptFinished = (promptId: string): void => {
  const finished = getFinishedPrompts();
  const updated = finished.filter(fp => fp.promptId !== promptId);
  localStorage.setItem(FINISHED_PROMPTS_KEY, JSON.stringify(updated));
};

export const getFinishedPromptsByGradeAndSection = (
  grade: 6 | 7 | 8,
  section: 'Humanity' | 'Honors'
): FinishedPrompt[] => {
  const finished = getFinishedPrompts();
  return finished.filter(fp => fp.grade === grade && fp.section === section);
};
