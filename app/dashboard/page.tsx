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

async function getDashboardData(userId: string) {
  const supabase = await createClient();

  // Get teacher lesson plans count
  const { count: teacherLessonsCount } = await supabase
    .from('teacher_lesson_plans')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  // Get tutor lesson plans count
  const { count: tutorLessonsCount } = await supabase
    .from('tutor_lesson_plans')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  const totalLessons = (teacherLessonsCount || 0) + (tutorLessonsCount || 0);

  // Get classes count
  const { count: classesCount } = await supabase
    .from('classes')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  // Get teacher students count
  const { count: teacherStudentsCount } = await supabase
    .from('teacher_student_profiles')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  // Get tutor students count
  const { count: tutorStudentsCount } = await supabase
    .from('tutor_student_profiles')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  const totalStudents = (teacherStudentsCount || 0) + (tutorStudentsCount || 0);

  // Get upcoming lessons (next 7 days) - teacher lessons
  const today = new Date().toISOString().split('T')[0];
  const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];

  const { data: upcomingTeacherLessons } = await supabase
    .from('teacher_lesson_plans')
    .select('*')
    .eq('user_id', userId)
    .gte('date_of_lesson', today)
    .lte('date_of_lesson', nextWeek)
    .order('date_of_lesson', { ascending: true })
    .order('time_of_lesson', { ascending: true })
    .limit(5);

  // Get upcoming tutor lessons
  const { data: upcomingTutorLessons } = await supabase
    .from('tutor_lesson_plans')
    .select('*')
    .eq('user_id', userId)
    .gte('date_of_lesson', today)
    .lte('date_of_lesson', nextWeek)
    .order('date_of_lesson', { ascending: true })
    .order('time_of_lesson', { ascending: true })
    .limit(5);

  // Get recent lessons (last 5)
  const { data: recentTeacherLessons } = await supabase
    .from('teacher_lesson_plans')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(3);

  const { data: recentTutorLessons } = await supabase
    .from('tutor_lesson_plans')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(3);

  // Get classes with student count
  const { data: classes } = await supabase
    .from('classes')
    .select(`
      *,
      class_students(count)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(5);

  // Get AI-generated lessons count (last 30 days)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    .toISOString();

  const { count: aiTeacherLessons } = await supabase
    .from('teacher_lesson_plans')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('created_with_ai', true)
    .gte('created_at', thirtyDaysAgo);

  const { count: aiTutorLessons } = await supabase
    .from('tutor_lesson_plans')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('created_with_ai', true)
    .gte('created_at', thirtyDaysAgo);

  const aiLessonsThisMonth = (aiTeacherLessons || 0) + (aiTutorLessons || 0);

  return {
    totalLessons,
    totalStudents,
    classesCount,
    aiLessonsThisMonth,
    upcomingLessons: [
      ...(upcomingTeacherLessons || []).map(l => ({ ...l, type: 'teacher' })),
      ...(upcomingTutorLessons || []).map(l => ({ ...l, type: 'tutor' }))
    ].sort((a, b) => {
      const dateA = new Date(`${a.date_of_lesson}T${a.time_of_lesson || '00:00'}`);
      const dateB = new Date(`${b.date_of_lesson}T${b.time_of_lesson || '00:00'}`);
      return dateA.getTime() - dateB.getTime();
    }).slice(0, 5),
    recentLessons: [
      ...(recentTeacherLessons || []).map(l => ({ ...l, type: 'teacher' })),
      ...(recentTutorLessons || []).map(l => ({ ...l, type: 'tutor' }))
    ].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    ).slice(0, 5),
    classes: classes || []
  };
}

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/login');
  }

  const dashboardData = await getDashboardData(user.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="max-w-7xl mx-auto p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-2">
            Welcome back! 👋
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Here's what's happening with your lessons today
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
            value={dashboardData.classesCount || 0}
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