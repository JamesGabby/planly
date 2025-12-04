export type StudentProfileTeacher = {
  student_id: string; // UUID
  created_at?: string; // ISO timestamp
  updated_at?: string; // ISO timestamp
  created_by: string;
  first_name: string;
  last_name?: string;
  class_name?: string;
  notes?: string | null;
  goals?: string;
  interests?: string;
  learning_preferences?: string;
  strengths?: string;
  weaknesses: string;
  special_educational_needs?: string;
  year_group?: string;
};

