// components/dashboard/RecentLessons.tsx
import { Clock, Sparkles, BookOpen } from 'lucide-react';
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
  created_with_ai?: boolean | null;
}

interface RecentLessonsProps {
  lessons: DashboardLesson[];
}

export default function RecentLessons({ lessons }: RecentLessonsProps) {
  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffWeeks = Math.floor(diffDays / 7);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffWeeks < 4) return `${diffWeeks}w ago`;
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
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
          <Clock className="w-5 h-5 text-green-500" />
          Recent Activity
        </h2>
        <Link 
          href="/dashboard/lesson-plans"
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          View all
        </Link>
      </div>

      {lessons.length === 0 ? (
        <div className="text-center py-8">
          <BookOpen className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            No recent lessons
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {lessons.map((lesson) => {
            const isTeacher = lesson.type === 'teacher';
            const studentOrClass = getStudentOrClassName(lesson);

            return (
              <Link
                key={`${lesson.type}-${lesson.id}`}
                href={getLessonLink(lesson)}
                className="block p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-600"
              >
                <div className="flex items-start gap-3">
                  <div className={clsx(
                    'p-2 rounded-lg flex-shrink-0',
                    isTeacher
                      ? 'bg-purple-100 dark:bg-purple-900/30'
                      : 'bg-blue-100 dark:bg-blue-900/30'
                  )}>
                    <BookOpen className={clsx(
                      'w-4 h-4',
                      isTeacher
                        ? 'text-purple-600 dark:text-purple-400'
                        : 'text-blue-600 dark:text-blue-400'
                    )} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-medium text-sm text-slate-900 dark:text-slate-50 truncate">
                        {lesson.topic || 'Untitled Lesson'}
                      </h3>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {lesson.created_with_ai && (
                          <span title="Created with AI">
                            <Sparkles className="w-4 h-4 text-yellow-500" />
                          </span>
                        )}
                        <span className={clsx(
                          'px-1.5 py-0.5 rounded text-xs font-medium',
                          isTeacher
                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                            : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                        )}>
                          {isTeacher ? 'Class' : 'Tutor'}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-xs text-slate-600 dark:text-slate-400 truncate mb-1">
                      {lesson.subject}
                      {studentOrClass && ` • ${studentOrClass}`}
                    </p>
                    
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                      <p className="text-xs text-slate-500 dark:text-slate-500">
                        {timeAgo(lesson.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}