// components/dashboard/UpcomingLessons.tsx
import { Calendar, Clock, BookOpen } from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';

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

interface UpcomingLessonsProps {
  lessons: DashboardLesson[];
}

export default function UpcomingLessons({ lessons }: UpcomingLessonsProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No date set';
    
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Reset time for comparison
    today.setHours(0, 0, 0, 0);
    tomorrow.setHours(0, 0, 0, 0);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);

    if (compareDate.getTime() === today.getTime()) {
      return 'Today';
    } else if (compareDate.getTime() === tomorrow.getTime()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-GB', { 
        weekday: 'short', 
        day: 'numeric', 
        month: 'short' 
      });
    }
  };

  const formatTime = (timeString: string | null) => {
    if (!timeString) return 'No time set';
    
    try {
      const [hours, minutes] = timeString.split(':');
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes));
      return date.toLocaleTimeString('en-GB', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch {
      return timeString;
    }
  };

  const getDateStatus = (dateString: string | null): 'today' | 'tomorrow' | 'upcoming' | 'none' => {
    if (!dateString) return 'none';
    
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    today.setHours(0, 0, 0, 0);
    tomorrow.setHours(0, 0, 0, 0);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);

    if (compareDate.getTime() === today.getTime()) return 'today';
    if (compareDate.getTime() === tomorrow.getTime()) return 'tomorrow';
    return 'upcoming';
  };

  const getLessonLink = (lesson: DashboardLesson) => {
    const baseUrl = lesson.type === 'teacher' 
      ? '/dashboard/lesson-plans/lesson/teacher'
      : '/tutor-dashboard/lesson-plans/lesson';
    return `${baseUrl}/${lesson.id}`;
  };

  const getStudentOrClassName = (lesson: DashboardLesson) => {
    if (lesson.type === 'teacher' && lesson.class) {
      return lesson.class;
    }
    if (lesson.type === 'tutor' && (lesson.first_name || lesson.last_name)) {
      return `${lesson.first_name || ''} ${lesson.last_name || ''}`.trim();
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-500" />
          Upcoming Lessons
        </h2>
        <Link 
          href="/dashboard/lesson-plans"
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          View all
        </Link>
      </div>

      {lessons.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500 dark:text-slate-400">
            No upcoming lessons scheduled
          </p>
          <Link
            href="/dashboard/lesson-plans/new"
            className="inline-block mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Create a lesson
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {lessons.map((lesson) => {
            const dateStatus = getDateStatus(lesson.date_of_lesson);
            const studentOrClass = getStudentOrClassName(lesson);
            const isTeacher = lesson.type === 'teacher';

            return (
              <Link
                key={`${lesson.type}-${lesson.id}`}
                href={getLessonLink(lesson)}
                className={clsx(
                  'block p-4 rounded-lg border transition-all',
                  dateStatus === 'today' 
                    ? 'border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30'
                    : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-slate-900 dark:text-slate-50 truncate">
                        {lesson.topic || 'Untitled Lesson'}
                      </h3>
                      {dateStatus === 'today' && (
                        <span className="px-1.5 py-0.5 rounded text-xs font-medium bg-blue-500 text-white">
                          Today
                        </span>
                      )}
                      {dateStatus === 'tomorrow' && (
                        <span className="px-1.5 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                          Tomorrow
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                      {lesson.subject}
                      {studentOrClass && ` • ${studentOrClass}`}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(lesson.date_of_lesson)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTime(lesson.time_of_lesson)}
                      </span>
                    </div>
                  </div>
                  
                  <span className={clsx(
                    'px-2 py-1 rounded text-xs font-medium flex-shrink-0',
                    isTeacher
                      ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                      : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                  )}>
                    {isTeacher ? 'Class' : 'Tutoring'}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}