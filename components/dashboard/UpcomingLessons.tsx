import { Calendar, Clock, BookOpen } from 'lucide-react';
import Link from 'next/link';

interface Lesson {
  id: string;
  date_of_lesson: string;
  time_of_lesson: string | null;
  topic: string;
  subject: string;
  class?: string;
  first_name?: string;
  last_name?: string;
  type: 'teacher' | 'tutor';
}

interface UpcomingLessonsProps {
  lessons: Lesson[];
}

export default function UpcomingLessons({ lessons }: UpcomingLessonsProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
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
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-GB', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-500" />
          Upcoming Lessons
        </h2>
        <Link 
          href="/lessons"
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
          {lessons.map((lesson) => (
            <Link
              key={lesson.id}
              href={`/dashboard/lesson-plans/lesson/${lesson.type === 'teacher' ? 'teacher' : 'tutor'}/${lesson.id}`}
              className="block p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-slate-900 dark:text-slate-50 truncate mb-1">
                    {lesson.topic || 'Untitled Lesson'}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                    {lesson.subject}
                    {lesson.type === 'teacher' && lesson.class && ` • ${lesson.class}`}
                    {lesson.type === 'tutor' && lesson.first_name && 
                      ` • ${lesson.first_name} ${lesson.last_name || ''}`
                    }
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
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  lesson.type === 'teacher' 
                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                    : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                }`}>
                  {lesson.type === 'teacher' ? 'Class' : 'Tutoring'}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}