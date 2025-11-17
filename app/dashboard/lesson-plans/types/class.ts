import { StudentProfileTeacher } from "./student_profile_teacher";

export type Class = {
  class_id: string; // UUID
  created_at?: string; // ISO timestamp
  updated_at?: string; // ISO timestamp
  created_by: string;
  class_name: string;
  year_group: string;
};

export interface ClassStudentJoin {
  student: StudentProfileTeacher | null;
}

export interface ClassWithStudents extends Class {
  students: StudentProfileTeacher[];
}
