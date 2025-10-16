export interface LessonResource {
  name?: string;
  url?: string;
}

export type LessonPlan = {
  id: string; // UUID
  user_id: string; // UUID
  class: string;
  date_of_lesson?: string | null; // ISO date string (YYYY-MM-DD)
  time_of_lesson?: string | null; // HH:MM:SS (24h)
  topic?: string | null;
  objectives?: string | null;
  outcomes?: string | null;
  resources: any[]; // JSONB default []
  homework?: string | null;
  specialist_subject_knowledge_required?: string | null;
  knowledge_revisited?: string | null;
  subject_pedagogies?: string | null;
  literacy_opportunities?: string | null;
  numeracy_opportunities?: string | null;
  health_and_safety_considerations?: string | null;
  timing?: string | null;
  teaching?: string | null;
  learning?: string | null;
  assessing?: string | null;
  adapting?: string | null;
  evaluation?: string | null;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
  lesson_structure?: Record<string, any> | null; // JSONB
  notes?: string | null;
};

