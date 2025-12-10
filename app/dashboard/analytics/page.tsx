// app/analytics/page.tsx
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { AnalyticsDashboard } from '../lesson-plans/dashboards/AnalyticsDashboard';
import {
  AnalyticsData,
  ClassDistributionData,
  LessonData,
  LessonsByMonthData,
  TeachingActivityData
} from '../lesson-plans/types/analytics';
import {
  TeacherLessonRow,
  TutorLessonRow,
  TeacherStudentRow,
  TutorStudentRow,
  TeacherClassStudentRow,
  TutorClassStudentRow,
  LessonRow
} from '../lesson-plans/types/analytics';

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
    teacherClasses,
    tutorClasses,
    teacherLessons,
    tutorLessons,
    teacherClassStudents,
    tutorClassStudents,
  ] = await Promise.all([
    // Teacher student profiles
    supabase
      .from('teacher_student_profiles')
      .select('student_id, special_educational_needs, year_group')
      .eq('user_id', userId),

    // Tutor student profiles
    supabase
      .from('tutor_student_profiles')
      .select('student_id, sen, level')
      .eq('user_id', userId),

    // Teacher classes
    supabase
      .from('teacher_classes')
      .select('class_id, class_name, year_group')
      .eq('user_id', userId),

    // Tutor classes
    supabase
      .from('tutor_classes')
      .select('class_id, class_name, year_group')
      .eq('user_id', userId),

    // Teacher lesson plans
    supabase
      .from('teacher_lesson_plans')
      .select('*')
      .eq('user_id', userId)
      .order('date_of_lesson', { ascending: false }),

    // Tutor lesson plans
    supabase
      .from('tutor_lesson_plans')
      .select('*')
      .eq('user_id', userId)
      .order('date_of_lesson', { ascending: false }),

    // Teacher class students with class info
    supabase
      .from('teacher_class_students')
      .select(`
        class_id,
        teacher_classes!inner(class_name, user_id)
      `)
      .eq('teacher_classes.user_id', userId),

    // Tutor class students with class info
    supabase
      .from('tutor_class_students')
      .select(`
        class_id,
        tutor_classes!inner(class_name, user_id)
      `)
      .eq('tutor_classes.user_id', userId),
  ]);

  // Handle potential errors with detailed logging
  const errors = [
    { name: 'teacherStudents', error: teacherStudents.error },
    { name: 'tutorStudents', error: tutorStudents.error },
    { name: 'teacherClasses', error: teacherClasses.error },
    { name: 'tutorClasses', error: tutorClasses.error },
    { name: 'teacherLessons', error: teacherLessons.error },
    { name: 'tutorLessons', error: tutorLessons.error },
    { name: 'teacherClassStudents', error: teacherClassStudents.error },
    { name: 'tutorClassStudents', error: tutorClassStudents.error },
  ];

  errors.forEach(({ name, error }) => {
    if (error) {
      console.error(`${name} error:`, error);
    }
  });

  // Type cast the data
  const allTeacherLessons = (teacherLessons.data as TeacherLessonRow[]) || [];
  const allTutorLessons = (tutorLessons.data as TutorLessonRow[]) || [];
  const allLessons: LessonRow[] = [...allTeacherLessons, ...allTutorLessons];

  const teacherStudentData = (teacherStudents.data as TeacherStudentRow[]) || [];
  const tutorStudentData = (tutorStudents.data as TutorStudentRow[]) || [];

  // Calculate date thresholds
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Calculate SEN students (teacher uses special_educational_needs, tutor uses sen)
  const studentsWithSEN = [
    ...teacherStudentData.filter(s => s.special_educational_needs && s.special_educational_needs.trim() !== ''),
    ...tutorStudentData.filter(s => s.sen && s.sen.trim() !== ''),
  ].length;

  // Lessons in last 30 days
  const lessonsLast30Days = allLessons.filter(l =>
    l.date_of_lesson && new Date(l.date_of_lesson) >= thirtyDaysAgo
  ).length;

  // Upcoming lessons (future dates)
  const upcomingLessons = allLessons
    .filter(l => l.date_of_lesson && new Date(l.date_of_lesson) >= now)
    .sort((a, b) => {
      const dateA = a.date_of_lesson ? new Date(a.date_of_lesson).getTime() : 0;
      const dateB = b.date_of_lesson ? new Date(b.date_of_lesson).getTime() : 0;
      return dateA - dateB;
    });

  // Evaluation metrics (both teacher and tutor lessons)
  const teacherLessonsWithEvaluation = allTeacherLessons.filter(l =>
    l.teacher_evaluation && l.teacher_evaluation.trim() !== ''
  ).length;

  const tutorLessonsWithEvaluation = allTutorLessons.filter(l =>
    l.teacher_evaluation && l.teacher_evaluation.trim() !== ''
  ).length;

  const totalLessonsWithEvaluation = teacherLessonsWithEvaluation + tutorLessonsWithEvaluation;

  const completionRate = allLessons.length > 0
    ? Math.round((totalLessonsWithEvaluation / allLessons.length) * 100)
    : 0;

  // AI generated lessons (both teacher and tutor)
  const aiGeneratedTeacherLessons = allTeacherLessons.filter(l =>
    l.created_with_ai === true
  ).length;

  const aiGeneratedTutorLessons = allTutorLessons.filter(l =>
    l.created_with_ai === true
  ).length;

  const aiGeneratedLessons = aiGeneratedTeacherLessons + aiGeneratedTutorLessons;

  // Total classes from both teacher and tutor tables
  const totalClasses = (teacherClasses.data?.length || 0) + (tutorClasses.data?.length || 0);

  // Process data for charts
  const lessonsBySubject = processLessonsBySubject(allLessons);
  const lessonsByMonth = processLessonsByMonth(allLessons);
  const studentsByYearGroup = processStudentsByYearGroup(teacherStudentData, tutorStudentData);

  // Process class distribution from both teacher and tutor class students
  const classDistribution = processClassDistribution(
    (teacherClassStudents.data as TeacherClassStudentRow[]) || [],
    (tutorClassStudents.data as TutorClassStudentRow[]) || []
  );

  const lessonsWithHomework = processHomeworkData(allLessons);
  const teachingActivity = processTeachingActivity(allTeacherLessons, allTutorLessons);

  // Get recent lessons (past dates, sorted by most recent)
  const recentLessons = allLessons
    .filter(l => l.date_of_lesson && new Date(l.date_of_lesson) < now)
    .sort((a, b) => {
      const dateA = a.date_of_lesson ? new Date(a.date_of_lesson).getTime() : 0;
      const dateB = b.date_of_lesson ? new Date(b.date_of_lesson).getTime() : 0;
      return dateB - dateA;
    });

  return {
    overview: {
      totalStudents: teacherStudentData.length + tutorStudentData.length,
      totalClasses,
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
      with: totalLessonsWithEvaluation,
      without: allLessons.length - totalLessonsWithEvaluation,
    },
    upcomingLessons: upcomingLessons.slice(0, 5).map(formatLessonData),
    recentLessons: recentLessons.slice(0, 5).map(formatLessonData),
    topSubjects: lessonsBySubject.slice(0, 5),
    teachingActivity,
  };
}

function formatLessonData(lesson: LessonRow): LessonData {
  const isTeacherLesson = 'class' in lesson;

  return {
    id: lesson.id,
    topic: lesson.topic || 'Untitled Lesson',
    subject: lesson.subject,
    date_of_lesson: lesson.date_of_lesson || '',
    time_of_lesson: lesson.time_of_lesson || undefined,
    class: isTeacherLesson ? (lesson as TeacherLessonRow).class : undefined,
    first_name: !isTeacherLesson ? (lesson as TutorLessonRow).first_name || undefined : undefined,
    last_name: !isTeacherLesson ? (lesson as TutorLessonRow).last_name || undefined : undefined,
    teacher_evaluation: lesson.teacher_evaluation || undefined,
  };
}

function processLessonsBySubject(lessons: LessonRow[]) {
  const subjectMap = new Map<string, number>();

  lessons.forEach(lesson => {
    if (lesson.subject) {
      const subject = lesson.subject.trim();
      if (subject) {
        subjectMap.set(subject, (subjectMap.get(subject) || 0) + 1);
      }
    }
  });

  return Array.from(subjectMap.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

function processLessonsByMonth(lessons: LessonRow[]): LessonsByMonthData[] {
  const monthMap = new Map<string, number>();
  const last6Months = new Date();
  last6Months.setMonth(last6Months.getMonth() - 6);

  lessons
    .filter(l => l.date_of_lesson && new Date(l.date_of_lesson) >= last6Months)
    .forEach(lesson => {
      if (!lesson.date_of_lesson) return;
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

function processStudentsByYearGroup(
  teacherStudents: TeacherStudentRow[],
  tutorStudents: TutorStudentRow[]
) {
  const yearMap = new Map<string, number>();

  // Process teacher students (year_group field)
  teacherStudents.forEach(student => {
    const year = student.year_group?.trim() || 'Not specified';
    yearMap.set(year, (yearMap.get(year) || 0) + 1);
  });

  // Process tutor students (level field - equivalent to year group/level)
  tutorStudents.forEach(student => {
    const level = student.level?.trim() || 'Not specified';
    yearMap.set(level, (yearMap.get(level) || 0) + 1);
  });

  return Array.from(yearMap.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => {
      if (a.name === 'Not specified') return 1;
      if (b.name === 'Not specified') return -1;
      const numA = parseInt(a.name);
      const numB = parseInt(b.name);
      if (!isNaN(numA) && !isNaN(numB)) {
        return numA - numB;
      }
      return a.name.localeCompare(b.name);
    });
}

function processClassDistribution(
  teacherClassStudents: TeacherClassStudentRow[],
  tutorClassStudents: TutorClassStudentRow[]
): ClassDistributionData[] {
  const classMap = new Map<string, number>();

  // Process teacher class students
  teacherClassStudents.forEach(cs => {
    let className: string = 'Unknown';

    if (cs.teacher_classes) {
      if (Array.isArray(cs.teacher_classes)) {
        className = cs.teacher_classes[0]?.class_name || 'Unknown';
      } else {
        className = cs.teacher_classes.class_name || 'Unknown';
      }
    }

    classMap.set(className, (classMap.get(className) || 0) + 1);
  });

  // Process tutor class students
  tutorClassStudents.forEach(cs => {
    let className: string = 'Unknown';

    if (cs.tutor_classes) {
      if (Array.isArray(cs.tutor_classes)) {
        className = cs.tutor_classes[0]?.class_name || 'Unknown';
      } else {
        className = cs.tutor_classes.class_name || 'Unknown';
      }
    }

    classMap.set(className, (classMap.get(className) || 0) + 1);
  });

  return Array.from(classMap.entries())
    .map(([name, students]) => ({ name, students }))
    .sort((a, b) => b.students - a.students);
}

function processHomeworkData(lessons: LessonRow[]) {
  const withHomework = lessons.filter(l => l.homework && l.homework.trim() !== '').length;
  return {
    with: withHomework,
    without: lessons.length - withHomework,
  };
}

function processTeachingActivity(
  teacherLessons: TeacherLessonRow[],
  tutorLessons: TutorLessonRow[]
): TeachingActivityData[] {
  const last6Months = new Date();
  last6Months.setMonth(last6Months.getMonth() - 6);

  const monthMap = new Map<string, { teacher: number; tutor: number }>();

  teacherLessons
    .filter(l => l.date_of_lesson && new Date(l.date_of_lesson) >= last6Months)
    .forEach(lesson => {
      if (!lesson.date_of_lesson) return;
      const date = new Date(lesson.date_of_lesson);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const current = monthMap.get(key) || { teacher: 0, tutor: 0 };
      monthMap.set(key, { ...current, teacher: current.teacher + 1 });
    });

  tutorLessons
    .filter(l => l.date_of_lesson && new Date(l.date_of_lesson) >= last6Months)
    .forEach(lesson => {
      if (!lesson.date_of_lesson) return;
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
    redirect('/auth/login');
  }

  const analyticsData = await fetchAnalyticsData(user.id);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Your Personalised Analytics
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