// components/analytics/AnalyticsDashboard.tsx
'use client';

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import {
  Users,
  BookOpen,
  Calendar,
  GraduationCap,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Clock,
  BarChart3,
  PieChart as PieChartIcon,
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { AnalyticsData } from '../types/analytics';
import clsx from 'clsx';

const COLORS = {
  primary: '#3b82f6',
  secondary: '#8b5cf6',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#06b6d4',
  purple: '#a855f7',
  pink: '#ec4899',
};

const CHART_COLORS = [
  COLORS.primary,
  COLORS.secondary,
  COLORS.success,
  COLORS.warning,
  COLORS.info,
  COLORS.purple,
  COLORS.pink,
  COLORS.danger,
];

interface Props {
  data: AnalyticsData;
}

// components/analytics/AnalyticsDashboard.tsx (continued - add these to the same file)

// MetricCard Component
interface MetricCardProps {
  title: string;
  value: number | string;
  icon: React.ElementType;
  color: 'blue' | 'purple' | 'green' | 'amber';
  subtitle?: string;
}

function MetricCard({ title, value, icon: Icon, color, subtitle }: MetricCardProps) {
  const colorClasses = {
    blue: 'bg-blue-500 text-white',
    purple: 'bg-purple-500 text-white',
    green: 'bg-green-500 text-white',
    amber: 'bg-amber-500 text-white',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {value}
          </p>
          {subtitle && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {subtitle}
            </p>
          )}
        </div>
        <div className={clsx('p-3 rounded-lg', colorClasses[color])}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}

// Alert Component
interface AlertProps {
  type: 'info' | 'warning' | 'success' | 'danger';
  title: string;
  message: string;
}

function Alert({ type, title, message }: AlertProps) {
  const styles = {
    info: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      icon: 'text-blue-600 dark:text-blue-400',
      title: 'text-blue-900 dark:text-blue-100',
      text: 'text-blue-700 dark:text-blue-300',
    },
    warning: {
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      border: 'border-amber-200 dark:border-amber-800',
      icon: 'text-amber-600 dark:text-amber-400',
      title: 'text-amber-900 dark:text-amber-100',
      text: 'text-amber-700 dark:text-amber-300',
    },
    success: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-800',
      icon: 'text-green-600 dark:text-green-400',
      title: 'text-green-900 dark:text-green-100',
      text: 'text-green-700 dark:text-green-300',
    },
    danger: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800',
      icon: 'text-red-600 dark:text-red-400',
      title: 'text-red-900 dark:text-red-100',
      text: 'text-red-700 dark:text-red-300',
    },
  };

  const style = styles[type];

  return (
    <div className={clsx('rounded-lg border p-4 flex items-start gap-3', style.bg, style.border)}>
      <AlertCircle className={clsx('w-5 h-5 flex-shrink-0 mt-0.5', style.icon)} />
      <div>
        <h3 className={clsx('font-semibold', style.title)}>{title}</h3>
        <p className={clsx('text-sm mt-1', style.text)}>{message}</p>
      </div>
    </div>
  );
}

// ChartCard Component
interface ChartCardProps {
  title: string;
  subtitle: string;
  icon: React.ElementType;
  children: React.ReactNode;
}

function ChartCard({ title, subtitle, icon: Icon, children }: ChartCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-start gap-3 mb-6">
        <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
            {subtitle}
          </p>
        </div>
      </div>
      {children}
    </div>
  );
}

// EmptyState Component
function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
        <BarChart3 className="w-8 h-8 text-gray-400 dark:text-gray-500" />
      </div>
      <p className="text-gray-500 dark:text-gray-400 text-center">{message}</p>
    </div>
  );
}

// InsightCard Component
interface InsightCardProps {
  title: string;
  data: Array<{ name: string; value: number; color: string }>;
}

function InsightCard({ title, data }: InsightCardProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
      <div className="space-y-3">
        {data.map((item, index) => {
          const percentage = total > 0 ? (item.value / total) * 100 : 0;
          return (
            <div key={index}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {item.name}
                </span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {item.value}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
      {total > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total
            </span>
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {total}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// LessonList Component
interface LessonListProps {
  title: string;
  subtitle: string;
  lessons: any[];
  emptyMessage: string;
  isUpcoming?: boolean;
}

function LessonList({ title, subtitle, lessons, emptyMessage, isUpcoming = false }: LessonListProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-start gap-3 mb-4">
        <div className={clsx(
          'p-2 rounded-lg',
          isUpcoming 
            ? 'bg-blue-100 dark:bg-blue-900/30' 
            : 'bg-gray-100 dark:bg-gray-700'
        )}>
          <Calendar className={clsx(
            'w-5 h-5',
            isUpcoming 
              ? 'text-blue-600 dark:text-blue-400' 
              : 'text-gray-600 dark:text-gray-400'
          )} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
            {subtitle}
          </p>
        </div>
      </div>

      {lessons.length > 0 ? (
        <div className="space-y-3">
          {lessons.map((lesson) => (
            <LessonItem key={lesson.id} lesson={lesson} isUpcoming={isUpcoming} />
          ))}
        </div>
      ) : (
        <EmptyState message={emptyMessage} />
      )}
    </div>
  );
}

// LessonItem Component
interface LessonItemProps {
  lesson: any;
  isUpcoming?: boolean;
}

function LessonItem({ lesson, isUpcoming = false }: LessonItemProps) {
  const studentName = lesson.first_name && lesson.last_name
    ? `${lesson.first_name} ${lesson.last_name}`
    : lesson.class || 'No class specified';

  return (
    <div className={clsx(
      'p-4 rounded-lg border transition-all hover:shadow-sm',
      isUpcoming
        ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800'
        : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600'
    )}>
      <div className="flex items-start gap-3">
        <div className={clsx(
          'p-2 rounded-lg flex-shrink-0',
          isUpcoming
            ? 'bg-blue-100 dark:bg-blue-900/30'
            : 'bg-gray-200 dark:bg-gray-600'
        )}>
          <BookOpen className={clsx(
            'w-4 h-4',
            isUpcoming
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-gray-600 dark:text-gray-400'
          )} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 dark:text-white truncate">
            {lesson.topic}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {lesson.subject} • {studentName}
          </p>
          <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
            <Calendar className="w-3 h-3" />
            <span>
              {lesson.date_of_lesson
                ? format(parseISO(lesson.date_of_lesson), 'MMM dd, yyyy')
                : 'No date'}
            </span>
            {lesson.time_of_lesson && (
              <>
                <span>•</span>
                <Clock className="w-3 h-3" />
                <span>{lesson.time_of_lesson}</span>
              </>
            )}
          </div>
          {lesson.evaluation && !isUpcoming && (
            <div className="mt-2 flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
              <CheckCircle2 className="w-3 h-3" />
              <span>Evaluated</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function AnalyticsDashboard({ data }: Props) {
  return (
    <div className="space-y-6">
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Students"
          value={data.overview.totalStudents}
          icon={Users}
          color="blue"
          subtitle={
            data.overview.studentsWithSEN > 0
              ? `${data.overview.studentsWithSEN} with SEN`
              : 'All students'
          }
        />
        <MetricCard
          title="Total Classes"
          value={data.overview.totalClasses}
          icon={GraduationCap}
          color="purple"
          subtitle="Active classes"
        />
        <MetricCard
          title="Total Lessons"
          value={data.overview.totalTeacherLessons + data.overview.totalTutorLessons}
          icon={BookOpen}
          color="green"
          subtitle={`${data.overview.lessonsLast30Days} in last 30 days`}
        />
        <MetricCard
          title="Completion Rate"
          value={`${data.overview.completionRate}%`}
          icon={CheckCircle2}
          color="amber"
          subtitle="Lessons with evaluation"
        />
      </div>

      {/* Alert for SEN Students */}
      {data.overview.studentsWithSEN > 0 && (
        <Alert
          type="info"
          title="Special Educational Needs"
          message={`You have ${data.overview.studentsWithSEN} student${
            data.overview.studentsWithSEN !== 1 ? 's' : ''
          } with documented SEN. Review their profiles for tailored lesson planning.`}
        />
      )}

      {/* Charts Row 1: Teaching Activity & Subject Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Teaching Activity"
          subtitle="Teacher vs Tutor lessons over time"
          icon={TrendingUp}
        >
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data.teachingActivity}>
              <defs>
                <linearGradient id="colorTeacher" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorTutor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.secondary} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={COLORS.secondary} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="name"
                stroke="#6b7280"
                fontSize={12}
                tickFormatter={(value) => {
                  const [year, month] = value.split('-');
                  return `${month}/${year.slice(2)}`;
                }}
              />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
                labelFormatter={(value) => {
                  const [year, month] = value.split('-');
                  const date = new Date(parseInt(year), parseInt(month) - 1);
                  return format(date, 'MMMM yyyy');
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="teacher"
                stroke={COLORS.primary}
                fillOpacity={1}
                fill="url(#colorTeacher)"
                name="Teacher Lessons"
              />
              <Area
                type="monotone"
                dataKey="tutor"
                stroke={COLORS.secondary}
                fillOpacity={1}
                fill="url(#colorTutor)"
                name="Tutor Lessons"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Lessons by Subject"
          subtitle="Distribution across subjects"
          icon={BarChart3}
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.lessonsBySubject.slice(0, 8)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="name"
                stroke="#6b7280"
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="value" fill={COLORS.primary} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Charts Row 2: Students & Classes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Students by Year Group"
          subtitle="Student distribution"
          icon={PieChartIcon}
        >
          {data.studentsByYearGroup.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.studentsByYearGroup}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.studentsByYearGroup.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CHART_COLORS[index % CHART_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState message="No student data available" />
          )}
        </ChartCard>

        <ChartCard
          title="Class Sizes"
          subtitle="Students per class"
          icon={Users}
        >
          {data.classDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.classDistribution} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" stroke="#6b7280" fontSize={12} />
                <YAxis
                  dataKey="name"
                  type="category"
                  stroke="#6b7280"
                  fontSize={12}
                  width={100}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="students" fill={COLORS.success} radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState message="No class data available" />
          )}
        </ChartCard>
      </div>

      {/* Insights Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <InsightCard
          title="Homework Assignment"
          data={[
            { name: 'With Homework', value: data.lessonsWithHomework.with, color: COLORS.success },
            { name: 'Without Homework', value: data.lessonsWithHomework.without, color: COLORS.danger },
          ]}
        />
        
        <InsightCard
          title="Lesson Evaluation"
          data={[
            { name: 'Evaluated', value: data.lessonsWithEvaluation.with, color: COLORS.primary },
            { name: 'Not Evaluated', value: data.lessonsWithEvaluation.without, color: COLORS.warning },
          ]}
        />

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Upcoming Lessons
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {data.overview.upcomingLessons} scheduled
              </p>
            </div>
          </div>
          <div className="text-center py-4">
            <p className="text-4xl font-bold text-purple-600 dark:text-purple-400">
              {data.overview.upcomingLessons}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              lessons in the pipeline
            </p>
          </div>
        </div>
      </div>

      {/* Lessons Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LessonList
          title="Upcoming Lessons"
          subtitle="Your next scheduled lessons"
          lessons={data.upcomingLessons}
          emptyMessage="No upcoming lessons scheduled"
          isUpcoming
        />
        
        <LessonList
          title="Recent Lessons"
          subtitle="Your recently taught lessons"
          lessons={data.recentLessons}
          emptyMessage="No recent lessons found"
        />
      </div>
    </div>
  );
}

// Sub-components will be in the next part