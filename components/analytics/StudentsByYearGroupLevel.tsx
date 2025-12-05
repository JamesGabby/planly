'use client';

import { useMemo, useState } from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieLabelRenderProps,
} from 'recharts';
import {
  Users,
  BarChart3,
  ChevronRight,
  GraduationCap,
  Info
} from 'lucide-react';
import clsx from 'clsx';
import type { YearGroupData, ClassDistributionData } from '@/app/dashboard/lesson-plans/types/analytics';

// ============================================
// Props Interface
// ============================================
interface StudentsClassesChartsProps {
  studentsByYearGroup: YearGroupData[];
  classDistribution: ClassDistributionData[];
}

// ============================================
// Extended Types for Internal Use
// ============================================
interface ProcessedClassData extends ClassDistributionData {
  displayName: string;
  index: number;
}

// ============================================
// Constants
// ============================================
const CHART_COLORS = [
  '#6366f1', // Indigo
  '#8b5cf6', // Violet  
  '#06b6d4', // Cyan
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ec4899', // Pink
  '#3b82f6', // Blue
  '#f97316', // Orange
  '#14b8a6', // Teal
  '#a855f7', // Purple
];

const BAR_GRADIENTS = [
  { start: '#10b981', end: '#34d399' },
  { start: '#06b6d4', end: '#22d3ee' },
  { start: '#6366f1', end: '#818cf8' },
  { start: '#8b5cf6', end: '#a78bfa' },
  { start: '#f59e0b', end: '#fbbf24' },
];

// ============================================
// Sub-components
// ============================================

interface TooltipPayloadItem {
  name: string;
  value: number;
  color?: string;
  payload?: {
    fill?: string;
    name?: string;
  };
}

interface EnhancedTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}

function EnhancedTooltip({ active, payload, label }: EnhancedTooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-2xl shadow-2xl p-4 min-w-[180px] backdrop-blur-xl">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100 dark:border-gray-700">
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: payload[0]?.color || payload[0]?.payload?.fill }}
        />
        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate max-w-[180px]">
          {payload[0]?.payload?.name || label}
        </p>
      </div>
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center justify-between gap-4 py-1">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {entry.name}
          </span>
          <span className="text-sm font-bold text-gray-900 dark:text-white tabular-nums">
            {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
          </span>
        </div>
      ))}
    </div>
  );
}

interface LegendPayloadItem {
  color?: string;
  value?: string | number;
}

interface CustomPieLegendProps {
  payload?: ReadonlyArray<LegendPayloadItem>;
  onHover?: (index: number | null) => void;
  activeIndex?: number | null;
}

// ============================================
// CustomPieLegend Component
// ============================================

function CustomPieLegend({ payload, onHover, activeIndex }: CustomPieLegendProps) {
  if (!payload?.length) return null;

  return (
    <div className="flex flex-wrap justify-center gap-2 mt-6 px-2">
      {payload.map((entry, index) => {
        const color = entry.color || '#6b7280';
        const value = String(entry.value ?? '');

        return (
          <button
            key={index}
            onMouseEnter={() => onHover?.(index)}
            onMouseLeave={() => onHover?.(null)}
            className={clsx(
              'flex items-center gap-2 px-3 py-1.5 rounded-full text-xs sm:text-sm transition-all duration-200',
              'border hover:shadow-md',
              activeIndex === index
                ? 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-500 scale-105'
                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
            )}
          >
            <span
              className={clsx(
                'w-2.5 h-2.5 rounded-full flex-shrink-0 transition-transform',
                activeIndex === index && 'scale-125'
              )}
              style={{ backgroundColor: color }}
            />
            <span
              className={clsx(
                'text-gray-700 dark:text-gray-300 truncate max-w-[80px] sm:max-w-[120px]',
                activeIndex === index && 'font-semibold'
              )}
            >
              {value}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function renderPieLabel(props: PieLabelRenderProps): React.ReactElement | null {
  const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;

  // Guard against undefined values
  if (
    typeof cx !== 'number' ||
    typeof cy !== 'number' ||
    typeof midAngle !== 'number' ||
    typeof innerRadius !== 'number' ||
    typeof outerRadius !== 'number' ||
    typeof percent !== 'number' ||
    percent < 0.06
  ) {
    return null;
  }

  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      className="text-[10px] sm:text-xs font-bold pointer-events-none"
      style={{
        textShadow: '0 1px 3px rgba(0,0,0,0.4)',
        fontFeatureSettings: '"tnum"'
      }}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

interface ChartCardProps {
  title: string;
  subtitle: string;
  icon: React.ElementType;
  iconColor?: 'indigo' | 'emerald' | 'violet' | 'amber';
  badge?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

function ChartCard({
  title,
  subtitle,
  icon: Icon,
  iconColor = 'indigo',
  badge,
  children,
  footer,
}: ChartCardProps) {
  const iconColors = {
    indigo: 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400',
    emerald: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400',
    violet: 'bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400',
    amber: 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
      <div className="px-5 sm:px-6 py-4 border-b border-gray-100 dark:border-gray-700/50">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className={clsx(
              'p-2.5 rounded-xl flex-shrink-0 transition-transform group-hover:scale-110',
              iconColors[iconColor]
            )}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white truncate">
                  {title}
                </h3>
                {badge}
              </div>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
                {subtitle}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="p-4 sm:p-6">{children}</div>
      {footer && (
        <div className="px-5 sm:px-6 py-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700/50">
          {footer}
        </div>
      )}
    </div>
  );
}

interface EmptyStateProps {
  message: string;
  icon?: React.ElementType;
  action?: React.ReactNode;
}

function EmptyState({
  message,
  icon: Icon = BarChart3,
  action
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-[280px] sm:h-[320px] text-center px-6">
      <div className="relative mb-4">
        <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-2xl flex items-center justify-center">
          <Icon className="w-10 h-10 text-gray-400 dark:text-gray-500" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
          <Info className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
        </div>
      </div>
      <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base font-medium mb-1">
        {message}
      </p>
      <p className="text-gray-400 dark:text-gray-500 text-xs max-w-[200px]">
        Data will appear here once students are added
      </p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

interface ClassStatsRowProps {
  data: ClassDistributionData[];
}

function ClassStatsRow({ data }: ClassStatsRowProps) {
  const stats = useMemo(() => {
    if (!data.length) return null;
    const sizes = data.map(d => d.students);
    return {
      avg: Math.round(sizes.reduce((a, b) => a + b, 0) / sizes.length),
      max: Math.max(...sizes),
      min: Math.min(...sizes),
    };
  }, [data]);

  if (!stats) return null;

  return (
    <div className="flex items-center justify-between gap-2 text-xs">
      <div className="flex items-center gap-4">
        <span className="text-gray-500 dark:text-gray-400">
          Avg: <span className="font-semibold text-gray-700 dark:text-gray-200">{stats.avg}</span>
        </span>
        <span className="text-gray-500 dark:text-gray-400">
          Max: <span className="font-semibold text-emerald-600 dark:text-emerald-400">{stats.max}</span>
        </span>
        <span className="text-gray-500 dark:text-gray-400">
          Min: <span className="font-semibold text-amber-600 dark:text-amber-400">{stats.min}</span>
        </span>
      </div>
      <span className="text-gray-400 dark:text-gray-500">
        {data.length} classes
      </span>
    </div>
  );
}

// ============================================
// Main Component
// ============================================
export function StudentsClassesCharts({
  studentsByYearGroup,
  classDistribution,
}: StudentsClassesChartsProps) {
  const [activePieIndex, setActivePieIndex] = useState<number | null>(null);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  const processedClassData = useMemo((): ProcessedClassData[] => {
    if (!classDistribution?.length) return [];
    return classDistribution
      .sort((a, b) => b.students - a.students)
      .slice(0, 10)
      .map((item, index) => ({
        ...item,
        displayName: item.name?.length > 15 ? `${item.name.substring(0, 15)}…` : item.name,
        index,
      }));
  }, [classDistribution]);

  const totalStudents = useMemo(() => {
    return studentsByYearGroup.reduce((sum, item) => sum + (item.value || 0), 0);
  }, [studentsByYearGroup]);

  const largestYearGroup = useMemo(() => {
    if (!studentsByYearGroup.length) return null;
    return studentsByYearGroup.reduce((max, item) =>
      item.value > max.value ? item : max
      , studentsByYearGroup[0]);
  }, [studentsByYearGroup]);

  const onPieEnter = (_: unknown, index: number) => {
    setActivePieIndex(index);
  };

  const onPieLeave = () => {
    setActivePieIndex(null);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 sm:gap-6">
      {/* Pie Chart - Students by Year Group */}
      <ChartCard
        title="Students by Year Group"
        subtitle="Distribution across academic levels"
        icon={GraduationCap}
        iconColor="violet"
        badge={
          totalStudents > 0 ? (
            <span className="px-2 py-0.5 bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 text-xs font-medium rounded-full">
              {studentsByYearGroup.length} groups
            </span>
          ) : null
        }
        footer={
          largestYearGroup && totalStudents > 0 ? (
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500 dark:text-gray-400">
                Largest group: <span className="font-semibold text-gray-700 dark:text-gray-200">{largestYearGroup.name}</span>
              </span>
              <span className="text-violet-600 dark:text-violet-400 font-medium">
                {largestYearGroup.value} students ({((largestYearGroup.value / totalStudents) * 100).toFixed(0)}%)
              </span>
            </div>
          ) : null
        }
      >
        {studentsByYearGroup.length > 0 ? (
          <div className="relative">
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={studentsByYearGroup}
                  cx="50%"
                  cy="45%"
                  labelLine={false}
                  label={renderPieLabel}
                  outerRadius={80}
                  innerRadius={0}
                  fill="#8884d8"
                  dataKey="value"
                  paddingAngle={3}
                  animationBegin={0}
                  animationDuration={1000}
                  animationEasing="ease-out"
                  onMouseEnter={onPieEnter}
                  onMouseLeave={onPieLeave}
                >
                  {studentsByYearGroup.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CHART_COLORS[index % CHART_COLORS.length]}
                      className="cursor-pointer transition-all duration-200"
                      stroke="white"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip content={<EnhancedTooltip />} />
                <Legend
                  content={({ payload }) => (
                    <CustomPieLegend
                      payload={payload as ReadonlyArray<{ color?: string; value?: string | number }>}
                      onHover={setActivePieIndex}
                      activeIndex={activePieIndex}
                    />
                  )}
                  verticalAlign="bottom"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <EmptyState
            message="No student data available"
            icon={GraduationCap}
          />
        )}
      </ChartCard>

      {/* Bar Chart - Class Sizes */}
      <ChartCard
        title="Class Sizes"
        subtitle="Students per class (Top 10)"
        icon={Users}
        iconColor="emerald"
        badge={
          processedClassData.length > 0 ? (
            <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-xs font-medium rounded-full">
              Top 10
            </span>
          ) : null
        }
        footer={<ClassStatsRow data={classDistribution} />}
      >
        {processedClassData.length > 0 ? (
          <div className="space-y-4">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={processedClassData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                barCategoryGap="25%"
              >
                {/* Gradient Definitions */}
                <defs>
                  {processedClassData.map((_, index) => {
                    const gradient = BAR_GRADIENTS[index % BAR_GRADIENTS.length];
                    return (
                      <linearGradient
                        key={`barGradient-${index}`}
                        id={`barGradient-${index}`}
                        x1="0"
                        y1="0"
                        x2="1"
                        y2="0"
                      >
                        <stop offset="0%" stopColor={gradient.start} />
                        <stop offset="100%" stopColor={gradient.end} />
                      </linearGradient>
                    );
                  })}
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e5e7eb"
                  horizontal={false}
                  vertical={true}
                />
                <XAxis
                  type="number"
                  stroke="#9ca3af"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => value.toLocaleString()}
                />
                <YAxis
                  dataKey="displayName"
                  type="category"
                  stroke="#6b7280"
                  fontSize={11}
                  width={100}
                  tickLine={false}
                  axisLine={false}
                  tick={({ x, y, payload }: { x: number; y: number; payload: { value: string } }) => {
                    const index = processedClassData.findIndex(
                      (item) => item.displayName === payload.value
                    );
                    return (
                      <g transform={`translate(${x},${y})`}>
                        <text
                          x={-8}
                          y={0}
                          dy={4}
                          textAnchor="end"
                          className={clsx(
                            'text-[11px] transition-all duration-200 fill-gray-600 dark:fill-gray-400',
                            hoveredBar === index && 'fill-gray-900 dark:fill-white font-semibold'
                          )}
                        >
                          {payload.value}
                        </text>
                      </g>
                    );
                  }}
                />
                <Tooltip
                  content={<EnhancedTooltip />}
                  cursor={{
                    fill: 'rgba(99, 102, 241, 0.08)',
                    radius: 8
                  }}
                />
                <Bar
                  dataKey="students"
                  name="Students"
                  radius={[0, 8, 8, 0]}
                  animationBegin={0}
                  animationDuration={1000}
                  animationEasing="ease-out"
                  onMouseEnter={(_, index) => setHoveredBar(index)}
                  onMouseLeave={() => setHoveredBar(null)}
                >
                  {processedClassData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={`url(#barGradient-${index})`}
                      className="cursor-pointer transition-all duration-200"
                      style={{
                        opacity: hoveredBar !== null && hoveredBar !== index ? 0.5 : 1,
                        filter: hoveredBar === index ? 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))' : 'none',
                      }}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            {/* Mobile-Friendly Card View */}
            <div className="block sm:hidden space-y-2 pt-4 border-t border-gray-100 dark:border-gray-700">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Quick View
              </p>
              {processedClassData.slice(0, 5).map((item, index) => {
                const gradient = BAR_GRADIENTS[index % BAR_GRADIENTS.length];
                const maxStudents = Math.max(...processedClassData.map(d => d.students));
                const percentage = maxStudents > 0 ? (item.students / maxStudents) * 100 : 0;

                return (
                  <div
                    key={item.name}
                    className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div
                      className="w-1.5 h-10 rounded-full flex-shrink-0"
                      style={{ backgroundColor: gradient.start }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {item.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${percentage}%`,
                              background: `linear-gradient(to right, ${gradient.start}, ${gradient.end})`
                            }}
                          />
                        </div>
                        <span className="text-xs font-bold text-gray-700 dark:text-gray-200 tabular-nums min-w-[28px] text-right">
                          {item.students}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                  </div>
                );
              })}

              {processedClassData.length > 5 && (
                <p className="text-xs text-center text-gray-400 dark:text-gray-500 pt-2">
                  +{processedClassData.length - 5} more classes
                </p>
              )}
            </div>
          </div>
        ) : (
          <EmptyState
            message="No class data available"
            icon={Users}
          />
        )}
      </ChartCard>
    </div>
  );
}