// components/dashboard/ClassesOverview.tsx
import Link from 'next/link';
import { GraduationCap, Users, Plus } from 'lucide-react';
import clsx from 'clsx';

interface DashboardClass {
  class_id: string;
  class_name: string;
  year_group: string | null;
  created_at: string;
  student_count: number;
  type: 'teacher' | 'tutor';
}

interface ClassesOverviewProps {
  classes: DashboardClass[];
}

export default function ClassesOverview({ classes }: ClassesOverviewProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50 flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-purple-500" />
          Your Classes
        </h2>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/classes"
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            View all
          </Link>
          <Link
            href="/dashboard/classes"
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Class
          </Link>
        </div>
      </div>

      {classes.length === 0 ? (
        <div className="text-center py-12">
          <GraduationCap className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500 dark:text-slate-400 mb-4">
            No classes created yet
          </p>
          <Link
            href="/dashboard/classes/new"
            className="inline-block px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Create your first class
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes.map((classItem) => {
            const isTeacher = classItem.type === 'teacher';
            const classLink = isTeacher 
              ? `/dashboard/classes/teacher/${classItem.class_id}`
              : `/dashboard/classes/tutor/${classItem.class_id}`;
            
            return (
              <Link
                key={`${classItem.type}-${classItem.class_id}`}
                href={classLink}
                className="block p-5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={clsx(
                    'p-2 rounded-lg group-hover:scale-110 transition-transform',
                    isTeacher 
                      ? 'bg-purple-100 dark:bg-purple-900/30' 
                      : 'bg-blue-100 dark:bg-blue-900/30'
                  )}>
                    <GraduationCap className={clsx(
                      'w-5 h-5',
                      isTeacher 
                        ? 'text-purple-600 dark:text-purple-400' 
                        : 'text-blue-600 dark:text-blue-400'
                    )} />
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Type Badge */}
                    <span className={clsx(
                      'px-2 py-1 rounded text-xs font-medium',
                      isTeacher
                        ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                        : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    )}>
                      {isTeacher ? 'Teacher' : 'Tutor'}
                    </span>
                    {/* Year Group Badge */}
                    {classItem.year_group && (
                      <span className="px-2 py-1 rounded text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        {classItem.year_group}
                      </span>
                    )}
                  </div>
                </div>
                
                <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {classItem.class_name}
                </h3>
                
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <Users className="w-4 h-4" />
                  <span>
                    {classItem.student_count} {classItem.student_count === 1 ? 'student' : 'students'}
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