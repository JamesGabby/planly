// app/analytics/page.tsx
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { AnalyticsDashboard } from '../lesson-plans/dashboards/AnalyticsDashboard';
import { AnalyticsData } from '../lesson-plans/types/analytics';

export const metadata = {
  title: 'Analytics Dashboard',
  description: 'Insights and analytics for your teaching activities',
};

async function fetchAnalyticsData(userId: string): Promise<AnalyticsData> {
  const supabase = await createClient();

  // Parallel data fetching for performance
  const [
    teacherStudents,
    tutorStudents,
    classes,
    teacherLessons,
    tutorLessons,
    classStudents,
  ] = await Promise.all([
    supabase
      .from('teacher_student_profiles')
      .select('student_id, special_educational_needs, year_group')
      .eq('user_id', userId),
    
    supabase
      .from('tutor_student_profiles')
      .select('student_id, sen, level')
      .eq('user_id', userId),
    
    supabase
      .from('classes')
      .select('class_id, class_name, year_group')
      .eq('user_id', userId),
    
    supabase
      .from('teacher_lesson_plans')
      .select('*')
      .eq('user_id', userId)
      .order('date_of_lesson', { ascending: false }),
    
    supabase
      .from('tutor_lesson_plans')
      .select('*')
      .eq('user_id', userId)
      .order('date_of_lesson', { ascending: false }),
    
    supabase
      .from('class_students')
      .select(`
        class_id,
        classes!inner(class_name, user_id)
      `)
      .eq('classes.user_id', userId),
  ]);

  const allTeacherLessons = teacherLessons.data || [];
  const allTutorLessons = tutorLessons.data || [];
  const allLessons = [...allTeacherLessons, ...allTutorLessons];

  // Calculate metrics
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const studentsWithSEN = [
    ...(teacherStudents.data || []).filter(s => s.special_educational_needs),
    ...(tutorStudents.data || []).filter(s => s.sen),
  ].length;

  const lessonsLast30Days = allLessons.filter(l => 
    l.date_of_lesson && new Date(l.date_of_lesson) >= thirtyDaysAgo
  ).length;

  const upcomingLessons = allLessons.filter(l => 
    l.date_of_lesson && new Date(l.date_of_lesson) >= now
  );

  const lessonsWithEvaluation = allTeacherLessons.filter(l => 
    l.evaluation && l.evaluation.trim() !== ''
  ).length;

  const completionRate = allTeacherLessons.length > 0 
    ? Math.round((lessonsWithEvaluation / allTeacherLessons.length) * 100)
    : 0;

  const aiGeneratedLessons = allTeacherLessons.filter(l => 
    l.created_with_ai === true
  ).length;

  // Process data for charts
  const lessonsBySubject = processLessonsBySubject(allLessons);
  const lessonsByMonth = processLessonsByMonth(allLessons);
  const studentsByYearGroup = processStudentsByYearGroup(teacherStudents.data || []);
  const classDistribution = processClassDistribution(classStudents.data || []);
  const lessonsWithHomework = processHomeworkData(allLessons);
  const teachingActivity = processTeachingActivity(allTeacherLessons, allTutorLessons);

  return {
    overview: {
      totalStudents: (teacherStudents.data?.length || 0) + (tutorStudents.data?.length || 0),
      totalClasses: classes.data?.length || 0,
      totalTeacherLessons: allTeacherLessons.length,
      totalTutorLessons: allTutorLessons.length,
      studentsWithSEN,
      lessonsLast30Days,
      upcomingLessons: upcomingLessons.length,
      completionRate,
      aiGeneratedLessons, 
    },
    lessonsBySubject,
    lessonsByMonth,
    studentsByYearGroup,
    classDistribution,
    lessonsWithHomework,
    lessonsWithEvaluation: {
      with: lessonsWithEvaluation,
      without: allTeacherLessons.length - lessonsWithEvaluation,
    },
    upcomingLessons: upcomingLessons.slice(0, 5).map(formatLessonData),
    recentLessons: allLessons
      .filter(l => l.date_of_lesson && new Date(l.date_of_lesson) < now)
      .slice(0, 5)
      .map(formatLessonData),
    topSubjects: lessonsBySubject.slice(0, 5),
    teachingActivity,
  };
}

function formatLessonData(lesson: any): any {
  return {
    id: lesson.id,
    topic: lesson.topic || 'Untitled Lesson',
    subject: lesson.subject,
    date_of_lesson: lesson.date_of_lesson,
    time_of_lesson: lesson.time_of_lesson,
    class: lesson.class,
    first_name: lesson.first_name,
    last_name: lesson.last_name,
    evaluation: lesson.evaluation,
  };
}

function processLessonsBySubject(lessons: any[]) {
  const subjectMap = new Map<string, number>();
  
  lessons.forEach(lesson => {
    if (lesson.subject) {
      subjectMap.set(lesson.subject, (subjectMap.get(lesson.subject) || 0) + 1);
    }
  });

  return Array.from(subjectMap.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

function processLessonsByMonth(lessons: any[]) {
  const monthMap = new Map<string, number>();
  const last6Months = new Date();
  last6Months.setMonth(last6Months.getMonth() - 6);

  lessons
    .filter(l => l.date_of_lesson && new Date(l.date_of_lesson) >= last6Months)
    .forEach(lesson => {
      const date = new Date(lesson.date_of_lesson);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthMap.set(key, (monthMap.get(key) || 0) + 1);
    });

  return Array.from(monthMap.entries())
    .map(([date, count]) => ({
      name: date,
      lessons: count,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function processStudentsByYearGroup(students: any[]) {
  const yearMap = new Map<string, number>();
  
  students.forEach(student => {
    const year = student.year_group || 'Not specified';
    yearMap.set(year, (yearMap.get(year) || 0) + 1);
  });

  return Array.from(yearMap.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => {
      if (a.name === 'Not specified') return 1;
      if (b.name === 'Not specified') return -1;
      return a.name.localeCompare(b.name);
    });
}

function processClassDistribution(classStudents: any[]) {
  const classMap = new Map<string, number>();
  
  classStudents.forEach(cs => {
    const className = cs.classes?.class_name || 'Unknown';
    classMap.set(className, (classMap.get(className) || 0) + 1);
  });

  return Array.from(classMap.entries())
    .map(([name, students]) => ({ name, students }))
    .sort((a, b) => b.students - a.students);
}

function processHomeworkData(lessons: any[]) {
  const withHomework = lessons.filter(l => l.homework && l.homework.trim() !== '').length;
  return {
    with: withHomework,
    without: lessons.length - withHomework,
  };
}

function processTeachingActivity(teacherLessons: any[], tutorLessons: any[]) {
  const last6Months = new Date();
  last6Months.setMonth(last6Months.getMonth() - 6);

  const monthMap = new Map<string, { teacher: number; tutor: number }>();

  teacherLessons
    .filter(l => l.date_of_lesson && new Date(l.date_of_lesson) >= last6Months)
    .forEach(lesson => {
      const date = new Date(lesson.date_of_lesson);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const current = monthMap.get(key) || { teacher: 0, tutor: 0 };
      monthMap.set(key, { ...current, teacher: current.teacher + 1 });
    });

  tutorLessons
    .filter(l => l.date_of_lesson && new Date(l.date_of_lesson) >= last6Months)
    .forEach(lesson => {
      const date = new Date(lesson.date_of_lesson);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const current = monthMap.get(key) || { teacher: 0, tutor: 0 };
      monthMap.set(key, { ...current, tutor: current.tutor + 1 });
    });

  return Array.from(monthMap.entries())
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const analyticsData = await fetchAnalyticsData(user.id);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Analytics Dashboard
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Track your teaching activities and student progress
          </p>
        </div>

        <AnalyticsDashboard data={analyticsData} />
      </div>
    </div>
  );
}