interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
  color?: 'blue' | 'green' | 'purple' | 'orange';
}

export default function StatsCard({ 
  title, 
  value, 
  icon, 
  trend, 
  trendUp,
  color = 'blue' 
}: StatsCardProps) {
  const colorClasses = {
    blue: 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400',
    green: 'bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400',
    purple: 'bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400',
    orange: 'bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400'
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
            {title}
          </p>
          <p className="text-3xl font-bold text-slate-900 dark:text-slate-50">
            {value}
          </p>
          {trend && (
            <p className={`text-xs mt-2 flex items-center gap-1 ${
              trendUp 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-slate-500 dark:text-slate-400'
            }`}>
              {trendUp && (
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                </svg>
              )}
              {trend}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}