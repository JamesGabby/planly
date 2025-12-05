// types/dashboard.ts

export interface DashboardLesson {
  id: string;
  topic: string | null;
  subject: string;
  date_of_lesson: string | null;
  time_of_lesson: string | null;
  created_at: string;
  class?: string;
  first_name?: string | null;
  last_name?: string | null;
  type: 'teacher' | 'tutor';
}

export interface DashboardClass {
  class_id: string;
  class_name: string;
  year_group: string | null;
  created_at: string;
  student_count: number;
  type: 'teacher' | 'tutor';
}

export interface DashboardData {
  totalLessons: number;
  totalStudents: number;
  totalClasses: number;
  aiLessonsThisMonth: number;
  upcomingLessons: DashboardLesson[];
  recentLessons: DashboardLesson[];
  classes: DashboardClass[];
}

export interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
  color: 'blue' | 'green' | 'purple' | 'orange';
}

export interface UpcomingLessonsProps {
  lessons: DashboardLesson[];
}

export interface RecentLessonsProps {
  lessons: DashboardLesson[];
}

export interface ClassesOverviewProps {
  classes: DashboardClass[];
}