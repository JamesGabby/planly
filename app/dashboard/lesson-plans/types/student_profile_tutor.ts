export type StudentProfileTutor = {
  student_id: string; // UUID
  created_at?: string; // ISO timestamp
  updated_at?: string; // ISO timestamp
  created_by?: string;
  first_name: string;
  last_name?: string;
  notes?: string | null;
  level?: string;
  goals?: string;
  interests?: string;
  learning_preferences?: string;
  strengths?: string;
  weaknesses: string;
  sen?: string;
};

