'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
  Cell,
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
  Sparkles,
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { AnalyticsData, LessonData } from '../types/analytics';
import clsx from 'clsx';
import { StudentsClassesCharts } from '@/components/analytics/StudentsByYearGroupLevel';
import { SubjectBadge } from '@/components/ui/subject-badge';
import { getSubjectColors, normalizeSubjectKey, SubjectKey } from '@/lib/utils/subjectColors';

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

// Subject color hex values for charts (matching your subjectColors utility)
const SUBJECT_HEX_COLORS: Record<SubjectKey, string> = {
  mathematics: '#3b82f6',      // blue-500
  english: '#f59e0b',          // amber-500
  science: '#22c55e',          // green-500
  history: '#f97316',          // orange-500
  geography: '#10b981',        // emerald-500
  art: '#ec4899',              // pink-500
  music: '#a855f7',            // purple-500
  physical_education: '#ef4444', // red-500
  computing: '#06b6d4',        // cyan-500
  computer_science: '#71717a', // zinc-500
  languages: '#6366f1',        // indigo-500
  religious_education: '#8b5cf6', // violet-500
  design_technology: '#78716c', // stone-500
  drama: '#d946ef',            // fuchsia-500
  business: '#14b8a6',         // teal-500
  psychology: '#f43f5e',       // rose-500
  economics: '#84cc16',        // lime-500
  biology: '#22c55e',          // green-500
  chemistry: '#eab308',        // yellow-500
  physics: '#0ea5e9',          // sky-500
  default: '#6b7280',          // gray-500
};

// Helper function to get hex color for a subject
function getSubjectHexColor(subject: string): string {
  const key = normalizeSubjectKey(subject);
  return SUBJECT_HEX_COLORS[key] || SUBJECT_HEX_COLORS.default;
}

interface Props {
  data: AnalyticsData;
}

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
  // Calculate percentage for the first item (e.g., "With Homework")
  const mainPercentage = total > 0 ? (data[0].value / total) * 100 : 0;

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
              {data[0].name}
            </span>
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {mainPercentage.toFixed(0)}%
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
  lessons: LessonData[];
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
  lesson: LessonData;
  isUpcoming?: boolean;
}

function LessonItem({ lesson, isUpcoming = false }: LessonItemProps) {
  const studentName = lesson.first_name && lesson.last_name
    ? `${lesson.first_name} ${lesson.last_name}`
    : lesson.class || 'No class specified';

  const lessonType = lesson.class ? 'Teacher' : 'Tutor';
  const subjectColors = getSubjectColors(lesson.subject || '');

  return (
    <div className={clsx(
      'p-4 rounded-lg border transition-all hover:shadow-sm',
      isUpcoming
        ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800'
        : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600'
    )}>
      <div className="flex items-start gap-3">
        <div className={clsx(
          'w-1 h-full min-h-[60px] rounded-full flex-shrink-0',
          subjectColors.dot
        )} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-medium text-gray-900 dark:text-white truncate">
              {lesson.topic}
            </h4>
            <span className={clsx(
              'text-xs px-2 py-0.5 rounded-full',
              lessonType === 'Teacher'
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
            )}>
              {lessonType}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1.5">
            {lesson.subject && (
              <SubjectBadge subject={lesson.subject} size="sm" />
            )}
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {studentName}
            </span>
          </div>
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
          {lesson.teacher_evaluation && !isUpcoming && (
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

// Custom Tooltip for Charts
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string; payload?: { name: string } }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
        <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

// Custom Tooltip for Subject Bar Chart
interface SubjectTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; payload: { name: string } }>;
}

function SubjectTooltip({ active, payload }: SubjectTooltipProps) {
  if (active && payload && payload.length) {
    const subjectName = payload[0].payload.name;
    const color = getSubjectHexColor(subjectName);
    
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
        <div className="flex items-center gap-2 mb-1">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: color }}
          />
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {subjectName}
          </p>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {payload[0].value} lessons
        </p>
      </div>
    );
  }
  return null;
}

export function AnalyticsDashboard({ data }: Props) {
  const totalLessons = data.overview.totalTeacherLessons + data.overview.totalTutorLessons;

  // Process subject data with colors
  const subjectDataWithColors = data.lessonsBySubject.slice(0, 8).map((subject) => ({
    ...subject,
    color: getSubjectHexColor(subject.name),
  }));

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
          value={totalLessons}
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

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Teacher Lessons</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {data.overview.totalTeacherLessons}
              </p>
            </div>
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Tutor Lessons</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {data.overview.totalTutorLessons}
              </p>
            </div>
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Upcoming Lessons</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {data.overview.upcomingLessons}
              </p>
            </div>
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Students with SEN</p>
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {data.overview.studentsWithSEN}
              </p>
            </div>
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
              <Users className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
        </div>
      </div>

      {/* AI Insights Section */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border border-purple-200 dark:border-purple-800 p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              AI-Assisted Teaching
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Leveraging artificial intelligence to enhance lesson planning
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {data.overview.aiGeneratedLessons}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  AI-Generated Lessons
                </p>
              </div>
              <div>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {totalLessons > 0
                    ? Math.round((data.overview.aiGeneratedLessons / totalLessons) * 100)
                    : 0}%
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Of Total Lessons
                </p>
              </div>
              <div>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {totalLessons - data.overview.aiGeneratedLessons}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Manual Lessons
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alert for SEN Students */}
      {data.overview.studentsWithSEN > 0 && (
        <Alert
          type="info"
          title="Special Educational Needs"
          message={`You have ${data.overview.studentsWithSEN} student${data.overview.studentsWithSEN !== 1 ? 's' : ''
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
          {data.teachingActivity.length > 0 ? (
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
                  content={<CustomTooltip />}
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
          ) : (
            <EmptyState message="No teaching activity data available" />
          )}
        </ChartCard>

        <ChartCard
          title="Lessons by Subject"
          subtitle="Distribution across subjects"
          icon={BarChart3}
        >
          {data.lessonsBySubject.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={subjectDataWithColors}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="name"
                    stroke="#6b7280"
                    fontSize={11}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    interval={0}
                  />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip content={<SubjectTooltip />} />
                  <Bar dataKey="value" name="Lessons" radius={[8, 8, 0, 0]}>
                    {subjectDataWithColors.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              {/* Subject Legend */}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex flex-wrap gap-2">
                  {subjectDataWithColors.map((subject) => (
                    <SubjectBadge 
                      key={subject.name} 
                      subject={subject.name} 
                      size="sm" 
                    />
                  ))}
                </div>
              </div>
            </>
          ) : (
            <EmptyState message="No subject data available" />
          )}
        </ChartCard>
      </div>

      <StudentsClassesCharts
        studentsByYearGroup={data.studentsByYearGroup}
        classDistribution={data.classDistribution}
      />

      {/* Charts Row 3: Lessons by Month */}
      <div className="grid grid-cols-1 gap-6">
        <ChartCard
          title="Lessons Over Time"
          subtitle="Total lessons created in the last 6 months"
          icon={TrendingUp}
        >
          {data.lessonsByMonth.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={data.lessonsByMonth}>
                <defs>
                  <linearGradient id="colorLessons" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.success} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={COLORS.success} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="name"
                  stroke="#6b7280"
                  fontSize={12}
                  tickFormatter={(value) => {
                    const [year, month] = value.split('-');
                    const date = new Date(parseInt(year), parseInt(month) - 1);
                    return format(date, 'MMM yyyy');
                  }}
                />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip
                  content={<CustomTooltip />}
                  labelFormatter={(value) => {
                    const [year, month] = value.split('-');
                    const date = new Date(parseInt(year), parseInt(month) - 1);
                    return format(date, 'MMMM yyyy');
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="lessons"
                  stroke={COLORS.success}
                  fillOpacity={1}
                  fill="url(#colorLessons)"
                  name="Lessons"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState message="No monthly data available" />
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

        <InsightCard
          title="Lesson Type Breakdown"
          data={[
            { name: 'Teacher Lessons', value: data.overview.totalTeacherLessons, color: COLORS.primary },
            { name: 'Tutor Lessons', value: data.overview.totalTutorLessons, color: COLORS.secondary },
          ]}
        />
      </div>

      {/* Top Subjects */}
      {data.topSubjects.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <BarChart3 className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Top Subjects
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your most frequently taught subjects
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {data.topSubjects.map((subject) => {
              const colors = getSubjectColors(subject.name);
              const hexColor = getSubjectHexColor(subject.name);
              
              return (
                <div
                  key={subject.name}
                  className={clsx(
                    'p-4 rounded-lg border transition-all hover:shadow-md',
                    colors.bg,
                    colors.border
                  )}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: hexColor }}
                    />
                    <span className={clsx(
                      'text-sm font-medium truncate',
                      colors.text
                    )}>
                      {subject.name}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {subject.value}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">lessons</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

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

      {/* Quick Stats Footer */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Summary
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
          <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {data.overview.totalStudents}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Total Students</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {data.overview.totalClasses}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Total Classes</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {totalLessons}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Total Lessons</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {data.overview.lessonsLast30Days}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Last 30 Days</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {data.overview.aiGeneratedLessons}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">AI Generated</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {data.lessonsBySubject.length}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Subjects Taught</p>
          </div>
        </div>
      </div>
    </div>
  );
}