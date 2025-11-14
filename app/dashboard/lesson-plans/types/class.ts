export type Class = {
  class_id: string; // UUID
  created_at?: string; // ISO timestamp
  updated_at?: string; // ISO timestamp
  created_by: string;
  class_name: string;
  year_group: string;
  students: {};  
};
