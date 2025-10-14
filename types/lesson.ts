export interface LessonResource {
  name?: string;
  url?: string;
}

export interface LessonPlan {
  id: string;
  user_id: string;
  class: string | null;
  date_of_lesson: string | null;
  time_of_lesson: string | null;
  topic: string | null;
  objectives: string | null;
  outcomes: string | null;
  resources: LessonResource[] | string | null;
  homework: string | null;
  specialist_subject_knowledge_required: string | null;
  knowledge_revisited: string | null;
  subject_pedagogies: string | null;
  literacy_opportunities: string | null;
  numeracy_opportunities: string | null;
  health_and_safety_considerations: string | null;
  timing: string | null;
  teaching: string | null;
  learning: string | null;
  assessing: string | null;
  adapting: string | null;
  evaluation: string | null;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
}
