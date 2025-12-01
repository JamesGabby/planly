// app/dashboard/lesson-plans/types/analytics.ts

export interface AnalyticsOverview {
  totalStudents: number;
  totalClasses: number;
  totalTeacherLessons: number;
  totalTutorLessons: number;
  studentsWithSEN: number;
  lessonsLast30Days: number;
  upcomingLessons: number;
  completionRate: number;
  aiGeneratedLessons: number;
}

export interface ChartData {
  name: string;
  value: number;
  [key: string]: string | number; // Allow additional properties
}

// NEW: Specific chart data types
export interface LessonsByMonthData {
  name: string;
  lessons: number;
}

export interface ClassDistributionData {
  name: string;
  students: number;
}

export interface TeachingActivityData {
  name: string;
  teacher: number;
  tutor: number;
}

export interface LessonData {
  id: string;
  topic: string;
  subject: string;
  date_of_lesson: string;
  time_of_lesson?: string;
  class?: string;
  first_name?: string;
  last_name?: string;
  evaluation?: string;
}

export interface AnalyticsData {
  overview: AnalyticsOverview;
  lessonsBySubject: ChartData[];
  lessonsByMonth: LessonsByMonthData[]; // CHANGED
  studentsByYearGroup: ChartData[];
  classDistribution: ClassDistributionData[]; // CHANGED
  lessonsWithHomework: { with: number; without: number };
  lessonsWithEvaluation: { with: number; without: number };
  upcomingLessons: LessonData[];
  recentLessons: LessonData[];
  topSubjects: ChartData[];
  teachingActivity: TeachingActivityData[]; // CHANGED
}

// Database row types
export interface TeacherLessonRow {
  id: string;
  user_id: string;
  class: string;
  date_of_lesson: string | null;
  time_of_lesson: string | null;
  topic: string | null;
  subject: string;
  year_group: string;
  objectives: string | null;
  outcomes: string | null;
  homework: string | null;
  evaluation: string | null;
  created_with_ai: boolean | null;
  created_at: string;
  updated_at: string;
  [key: string]: unknown;
}

export interface TutorLessonRow {
  id: string;
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  student_id: string | null;
  date_of_lesson: string | null;
  time_of_lesson: string | null;
  topic: string | null;
  subject: string;
  objectives: string | null;
  outcomes: string | null;
  homework: string | null;
  evaluation: string | null;
  created_at: string;
  updated_at: string;
  [key: string]: unknown;
}

// Separate types for different student profiles
export interface TeacherStudentRow {
  student_id: string;
  year_group: string | null;
  special_educational_needs: string | null;
  [key: string]: unknown;
}

export interface TutorStudentRow {
  student_id: string;
  sen: string | null;
  level: string | null;
  [key: string]: unknown;
}

export interface ClassStudentRow {
  class_id: string;
  classes: {
    class_name: string;
    user_id: string;
  }[] | null; // It's an array, not a single object
}

// Union type for lessons
export type LessonRow = TeacherLessonRow | TutorLessonRow;