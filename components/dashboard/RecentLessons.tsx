import { Clock, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface Lesson {
  id: string;
  topic: string;
  subject: string;
  created_at: string;
  created_with_ai: boolean;
  type: 'teacher' | 'tutor';
  class?: string;
  first_name?: string;
  last_name?: string;
}

interface RecentLessonsProps {
  lessons: Lesson[];
}

export default function RecentLessons({ lessons }: RecentLessonsProps) {
  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50 flex items-center gap-2">
          <Clock className="w-5 h-5 text-green-500" />
          Recent Activity
        </h2>
      </div>

      {lessons.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            No recent lessons
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {lessons.map((lesson) => (
            <Link
              key={lesson.id}
              href={`/dashboard/lesson-plans/lesson/${lesson.type === 'teacher' ? 'teacher' : 'tutor'}/${lesson.id}`}
              className="block p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg flex-shrink-0 ${
                  lesson.type === 'teacher'
                    ? 'bg-purple-100 dark:bg-purple-900/30'
                    : 'bg-blue-100 dark:bg-blue-900/30'
                }`}>
                  <Clock className={`w-4 h-4 ${
                    lesson.type === 'teacher'
                      ? 'text-purple-600 dark:text-purple-400'
                      : 'text-blue-600 dark:text-blue-400'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-medium text-sm text-slate-900 dark:text-slate-50 truncate">
                      {lesson.topic || 'Untitled Lesson'}
                    </h3>
                    {lesson.created_with_ai && (
                      <Sparkles className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 truncate mb-1">
                    {lesson.subject}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-500">
                    {timeAgo(lesson.created_at)}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}