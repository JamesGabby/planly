import Link from 'next/link';
import { Plus, Users, GraduationCap, Sparkles } from 'lucide-react';

export default function QuickActions() {
  const actions = [
    {
      href: '/dashboard/lesson-plans/new',
      label: 'Create Lesson Plan',
      icon: <Plus className="w-5 h-5" />,
      color: 'bg-blue-500 hover:bg-blue-600',
    },
    {
      href: '/lessons/ai',
      label: 'AI Lesson Builder',
      icon: <Sparkles className="w-5 h-5" />,
      color: 'bg-purple-500 hover:bg-purple-600',
    },
    {
      href: '/dashboard/student-profiles',
      label: 'Manage Students',
      icon: <Users className="w-5 h-5" />,
      color: 'bg-green-500 hover:bg-green-600',
    },
    {
      href: '/dashboard/classes',
      label: 'View Classes',
      icon: <GraduationCap className="w-5 h-5" />,
      color: 'bg-orange-500 hover:bg-orange-600',
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">
        Quick Actions
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {actions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className={`${action.color} text-white rounded-lg p-4 flex flex-col items-center justify-center gap-2 transition-all transform hover:scale-105 shadow-sm hover:shadow-md`}
          >
            {action.icon}
            <span className="text-sm font-medium text-center">
              {action.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}