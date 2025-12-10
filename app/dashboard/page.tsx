// app/dashboard/page.tsx
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import StatsCard from '@/components/dashboard/StatsCard';
import RecentLessons from '@/components/dashboard/RecentLessons';
import UpcomingLessons from '@/components/dashboard/UpcomingLessons';
import QuickActions from '@/components/dashboard/QuickActions';
import ClassesOverview from '@/components/dashboard/ClassesOverview';
import { 
  BookOpen, 
  Users, 
  Calendar, 
  GraduationCap 
} from 'lucide-react';

export const dynamic = 'force-dynamic';

// Types for dashboard data
interface DashboardLesson {
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

interface DashboardClass {
  class_id: string;
  class_name: string;
  year_group: string | null;
  created_at: string;
  student_count: number;
  type: 'teacher' | 'tutor';
}

interface DashboardData {
  totalLessons: number;
  totalStudents: number;
  totalClasses: number;
  aiLessonsThisMonth: number;
  upcomingLessons: DashboardLesson[];
  recentLessons: DashboardLesson[];
  classes: DashboardClass[];
}

async function getDashboardData(userId: string): Promise<DashboardData> {
  const supabase = await createClient();

  // Calculate date ranges
  const today = new Date().toISOString().split('T')[0];
  const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    .toISOString();

  // Parallel fetch all data for performance
  const [
    // Lesson counts
    teacherLessonsCount,
    tutorLessonsCount,
    // Class counts
    teacherClassesCount,
    tutorClassesCount,
    // Student counts
    teacherStudentsCount,
    tutorStudentsCount,
    // Upcoming lessons
    upcomingTeacherLessons,
    upcomingTutorLessons,
    // Recent lessons
    recentTeacherLessons,
    recentTutorLessons,
    // Classes with student counts
    teacherClasses,
    tutorClasses,
    // Teacher class student counts
    teacherClassStudents,
    tutorClassStudents,
    // AI lessons count
    aiTeacherLessons,
    aiTutorLessons,
  ] = await Promise.all([
    // Teacher lesson plans count
    supabase
      .from('teacher_lesson_plans')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId),
    
    // Tutor lesson plans count
    supabase
      .from('tutor_lesson_plans')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId),
    
    // Teacher classes count
    supabase
      .from('teacher_classes')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId),
    
    // Tutor classes count
    supabase
      .from('tutor_classes')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId),
    
    // Teacher students count
    supabase
      .from('teacher_student_profiles')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId),
    
    // Tutor students count
    supabase
      .from('tutor_student_profiles')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId),
    
    // Upcoming teacher lessons (next 7 days)
    supabase
      .from('teacher_lesson_plans')
      .select('id, topic, subject, date_of_lesson, time_of_lesson, created_at, class')
      .eq('user_id', userId)
      .gte('date_of_lesson', today)
      .lte('date_of_lesson', nextWeek)
      .order('date_of_lesson', { ascending: true })
      .order('time_of_lesson', { ascending: true })
      .limit(5),
    
    // Upcoming tutor lessons (next 7 days)
    supabase
      .from('tutor_lesson_plans')
      .select('id, topic, subject, date_of_lesson, time_of_lesson, created_at, first_name, last_name')
      .eq('user_id', userId)
      .gte('date_of_lesson', today)
      .lte('date_of_lesson', nextWeek)
      .order('date_of_lesson', { ascending: true })
      .order('time_of_lesson', { ascending: true })
      .limit(5),
    
    // Recent teacher lessons
    supabase
      .from('teacher_lesson_plans')
      .select('id, topic, subject, date_of_lesson, time_of_lesson, created_at, class')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(3),
    
    // Recent tutor lessons
    supabase
      .from('tutor_lesson_plans')
      .select('id, topic, subject, date_of_lesson, time_of_lesson, created_at, first_name, last_name')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(3),
    
    // Teacher classes
    supabase
      .from('teacher_classes')
      .select('class_id, class_name, year_group, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5),
    
    // Tutor classes
    supabase
      .from('tutor_classes')
      .select('class_id, class_name, year_group, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5),
    
    // Teacher class students (for counting)
    supabase
      .from('teacher_class_students')
      .select('class_id'),
    
    // Tutor class students (for counting)
    supabase
      .from('tutor_class_students')
      .select('class_id'),
    
    // AI teacher lessons (last 30 days)
    supabase
      .from('teacher_lesson_plans')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('created_with_ai', true)
      .gte('created_at', thirtyDaysAgo),
    
    // AI tutor lessons (last 30 days)
    supabase
      .from('tutor_lesson_plans')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('created_with_ai', true)
      .gte('created_at', thirtyDaysAgo),
  ]);

  // Calculate totals
  const totalLessons = (teacherLessonsCount.count || 0) + (tutorLessonsCount.count || 0);
  const totalStudents = (teacherStudentsCount.count || 0) + (tutorStudentsCount.count || 0);
  const totalClasses = (teacherClassesCount.count || 0) + (tutorClassesCount.count || 0);
  const aiLessonsThisMonth = (aiTeacherLessons.count || 0) + (aiTutorLessons.count || 0);

  // Create student count maps for classes
  const teacherClassStudentCounts = new Map<string, number>();
  (teacherClassStudents.data || []).forEach(cs => {
    const count = teacherClassStudentCounts.get(cs.class_id) || 0;
    teacherClassStudentCounts.set(cs.class_id, count + 1);
  });

  const tutorClassStudentCounts = new Map<string, number>();
  (tutorClassStudents.data || []).forEach(cs => {
    const count = tutorClassStudentCounts.get(cs.class_id) || 0;
    tutorClassStudentCounts.set(cs.class_id, count + 1);
  });

  // Process teacher classes with student counts
  const processedTeacherClasses: DashboardClass[] = (teacherClasses.data || []).map(c => ({
    class_id: c.class_id,
    class_name: c.class_name,
    year_group: c.year_group,
    created_at: c.created_at,
    student_count: teacherClassStudentCounts.get(c.class_id) || 0,
    type: 'teacher' as const,
  }));

  // Process tutor classes with student counts
  const processedTutorClasses: DashboardClass[] = (tutorClasses.data || []).map(c => ({
    class_id: c.class_id,
    class_name: c.class_name,
    year_group: c.year_group,
    created_at: c.created_at,
    student_count: tutorClassStudentCounts.get(c.class_id) || 0,
    type: 'tutor' as const,
  }));

  // Combine and sort classes by created_at
  const combinedClasses = [...processedTeacherClasses, ...processedTutorClasses]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  // Process upcoming lessons
  const processedUpcomingTeacher: DashboardLesson[] = (upcomingTeacherLessons.data || []).map(l => ({
    id: l.id,
    topic: l.topic,
    subject: l.subject,
    date_of_lesson: l.date_of_lesson,
    time_of_lesson: l.time_of_lesson,
    created_at: l.created_at,
    class: l.class,
    type: 'teacher' as const,
  }));

  const processedUpcomingTutor: DashboardLesson[] = (upcomingTutorLessons.data || []).map(l => ({
    id: l.id,
    topic: l.topic,
    subject: l.subject,
    date_of_lesson: l.date_of_lesson,
    time_of_lesson: l.time_of_lesson,
    created_at: l.created_at,
    first_name: l.first_name,
    last_name: l.last_name,
    type: 'tutor' as const,
  }));

  // Combine and sort upcoming lessons
  const combinedUpcoming = [...processedUpcomingTeacher, ...processedUpcomingTutor]
    .sort((a, b) => {
      const dateA = new Date(`${a.date_of_lesson}T${a.time_of_lesson || '00:00'}`);
      const dateB = new Date(`${b.date_of_lesson}T${b.time_of_lesson || '00:00'}`);
      return dateA.getTime() - dateB.getTime();
    })
    .slice(0, 5);

  // Process recent lessons
  const processedRecentTeacher: DashboardLesson[] = (recentTeacherLessons.data || []).map(l => ({
    id: l.id,
    topic: l.topic,
    subject: l.subject,
    date_of_lesson: l.date_of_lesson,
    time_of_lesson: l.time_of_lesson,
    created_at: l.created_at,
    class: l.class,
    type: 'teacher' as const,
  }));

  const processedRecentTutor: DashboardLesson[] = (recentTutorLessons.data || []).map(l => ({
    id: l.id,
    topic: l.topic,
    subject: l.subject,
    date_of_lesson: l.date_of_lesson,
    time_of_lesson: l.time_of_lesson,
    created_at: l.created_at,
    first_name: l.first_name,
    last_name: l.last_name,
    type: 'tutor' as const,
  }));

  // Combine and sort recent lessons
  const combinedRecent = [...processedRecentTeacher, ...processedRecentTutor]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  return {
    totalLessons,
    totalStudents,
    totalClasses,
    aiLessonsThisMonth,
    upcomingLessons: combinedUpcoming,
    recentLessons: combinedRecent,
    classes: combinedClasses,
  };
}

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/login');
  }

  // Get display name from user metadata
  const displayName = user.user_metadata?.full_name 
    || user.user_metadata?.display_name 
    || user.user_metadata?.name
    || user.email?.split('@')[0]
    || 'there';

  // Get first name only for a friendlier greeting
  const firstName = displayName.split(' ')[0];

  // Check login count to determine welcome message
  const loginCount = user.user_metadata?.login_count || 0;
  const isFirstLogin = loginCount <= 1;

  const dashboardData = await getDashboardData(user.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="max-w-7xl mx-auto p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-2 capitalize">
            {isFirstLogin ? (
              <>Welcome, {firstName}! 🎉</>
            ) : (
              <>Welcome back, {firstName}! 👋</>
            )}
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            {isFirstLogin ? (
              "We're excited to have you! Let's get started with your first lesson."
            ) : (
              "Here's what's happening with your lessons today"
            )}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Lessons"
            value={dashboardData.totalLessons}
            icon={<BookOpen className="w-5 h-5" />}
            trend="+12% from last month"
            trendUp={true}
            color="blue"
          />
          <StatsCard
            title="Students"
            value={dashboardData.totalStudents}
            icon={<Users className="w-5 h-5" />}
            color="green"
          />
          <StatsCard
            title="Classes"
            value={dashboardData.totalClasses}
            icon={<GraduationCap className="w-5 h-5" />}
            color="purple"
          />
          <StatsCard
            title="AI Lessons (30d)"
            value={dashboardData.aiLessonsThisMonth}
            icon={<Calendar className="w-5 h-5" />}
            trend="Created with AI"
            color="orange"
          />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <QuickActions />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upcoming Lessons - Takes 2 columns */}
          <div className="lg:col-span-2">
            <UpcomingLessons lessons={dashboardData.upcomingLessons} />
          </div>

          {/* Recent Activity - Takes 1 column */}
          <div>
            <RecentLessons lessons={dashboardData.recentLessons} />
          </div>
        </div>

        {/* Classes Overview */}
        <div className="mt-6">
          <ClassesOverview classes={dashboardData.classes} />
        </div>
      </div>
    </div>
  );
}