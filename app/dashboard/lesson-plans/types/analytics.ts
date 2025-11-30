// types/analytics.ts
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
  [key: string]: any;
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
  lessonsByMonth: ChartData[];
  studentsByYearGroup: ChartData[];
  classDistribution: ChartData[];
  lessonsWithHomework: { with: number; without: number };
  lessonsWithEvaluation: { with: number; without: number };
  upcomingLessons: LessonData[];
  recentLessons: LessonData[];
  topSubjects: ChartData[];
  teachingActivity: ChartData[];
}