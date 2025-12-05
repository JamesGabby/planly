// types/analytics.ts

// ============================================
// Database Row Types
// ============================================

export interface TeacherLessonRow {
  id: string;
  user_id: string;
  class: string;
  date_of_lesson: string | null;
  time_of_lesson: string | null;
  topic: string | null;
  objectives: string | null;
  outcomes: string | null;
  resources: unknown;
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
  created_at: string;
  updated_at: string;
  lesson_structure: unknown;
  notes: string | null;
  exam_board: string | null;
  subject: string;
  year_group: string;
  custom_exam_board: string | null;
  student: string | null;
  created_with_ai: boolean | null;
}

export interface TutorLessonRow {
  id: string;
  user_id: string;
  date_of_lesson: string | null;
  time_of_lesson: string | null;
  topic: string | null;
  objectives: string | null;
  outcomes: string | null;
  resources: unknown;
  homework: string | null;
  knowledge_revisited: string | null;
  subject_pedagogies: string | null;
  literacy_opportunities: string | null;
  numeracy_opportunities: string | null;
  timing: string | null;
  teaching: string | null;
  learning: string | null;
  assessing: string | null;
  adapting: string | null;
  evaluation: string | null;
  created_at: string;
  updated_at: string;
  lesson_structure: unknown;
  notes: string | null;
  exam_board: string | null;
  subject: string;
  first_name: string | null;
  student_id: string | null;
  last_name: string | null;
  created_with_ai: boolean | null;
}

export type LessonRow = TeacherLessonRow | TutorLessonRow;

// ============================================
// Student Row Types
// ============================================

export interface TeacherStudentRow {
  student_id: string;
  special_educational_needs: string | null;
  year_group: string | null;
}

export interface TutorStudentRow {
  student_id: string;
  sen: string | null;
  level: string | null;
}

// ============================================
// Class Row Types
// ============================================

export interface TeacherClassRow {
  class_id: string;
  class_name: string;
  year_group: string | null;
}

export interface TutorClassRow {
  class_id: string;
  class_name: string;
  year_group: string | null;
}

// ============================================
// Class Student Join Types
// ============================================

interface ClassInfo {
  class_name: string;
  user_id: string;
}

export interface TeacherClassStudentRow {
  class_id: string;
  teacher_classes: ClassInfo | ClassInfo[];
}

export interface TutorClassStudentRow {
  class_id: string;
  tutor_classes: ClassInfo | ClassInfo[];
}

// ============================================
// Analytics Overview Types
// ============================================

export interface OverviewData {
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

// ============================================
// Lesson Display Types
// ============================================

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

// ============================================
// Chart Data Types
// ============================================

export interface SubjectData {
  name: string;
  value: number;
}

export interface LessonsByMonthData {
  name: string;
  lessons: number;
}

export interface YearGroupData {
  name: string;
  value: number;
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

// ============================================
// Insight Data Types
// ============================================

export interface HomeworkData {
  with: number;
  without: number;
}

export interface EvaluationData {
  with: number;
  without: number;
}

export interface InsightItemData {
  name: string;
  value: number;
  color: string;
}

// ============================================
// Main Analytics Data Type
// ============================================

export interface AnalyticsData {
  overview: OverviewData;
  lessonsBySubject: SubjectData[];
  lessonsByMonth: LessonsByMonthData[];
  studentsByYearGroup: YearGroupData[];
  classDistribution: ClassDistributionData[];
  lessonsWithHomework: HomeworkData;
  lessonsWithEvaluation: EvaluationData;
  upcomingLessons: LessonData[];
  recentLessons: LessonData[];
  topSubjects: SubjectData[];
  teachingActivity: TeachingActivityData[];
}

// ============================================
// Component Props Types
// ============================================

export interface AnalyticsDashboardProps {
  data: AnalyticsData;
}

export interface MetricCardProps {
  title: string;
  value: number | string;
  icon: React.ElementType;
  color: 'blue' | 'purple' | 'green' | 'amber';
  subtitle?: string;
}

export interface AlertProps {
  type: 'info' | 'warning' | 'success' | 'danger';
  title: string;
  message: string;
}

export interface ChartCardProps {
  title: string;
  subtitle: string;
  icon: React.ElementType;
  children: React.ReactNode;
}

export interface InsightCardProps {
  title: string;
  data: InsightItemData[];
}

export interface LessonListProps {
  title: string;
  subtitle: string;
  lessons: LessonData[];
  emptyMessage: string;
  isUpcoming?: boolean;
}

export interface LessonItemProps {
  lesson: LessonData;
  isUpcoming?: boolean;
}

export interface EmptyStateProps {
  message: string;
}

export interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
    dataKey?: string;
  }>;
  label?: string;
}

// ============================================
// Utility Types
// ============================================

export type ColorVariant = 'blue' | 'purple' | 'green' | 'amber';

export type AlertType = 'info' | 'warning' | 'success' | 'danger';

export interface ColorConfig {
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  danger: string;
  info: string;
  purple: string;
  pink: string;
}

// ============================================
// API Response Types (if needed)
// ============================================

export interface AnalyticsApiResponse {
  success: boolean;
  data?: AnalyticsData;
  error?: string;
}

// ============================================
// Filter Types (for future use)
// ============================================

export interface AnalyticsFilters {
  dateRange?: {
    start: Date;
    end: Date;
  };
  lessonType?: 'teacher' | 'tutor' | 'all';
  subject?: string;
  yearGroup?: string;
}

export interface DateRangeOption {
  label: string;
  value: string;
  days: number;
}