"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, User } from "lucide-react";
import { LessonPlanTutor } from "../../types/lesson_tutor";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface TutorCalendarViewProps {
  lessons: LessonPlanTutor[];
  onLessonClick: (lesson: LessonPlanTutor) => void;
  loading?: boolean;
}

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAYS_OF_WEEK_FULL = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export function TutorCalendarView({ lessons, onLessonClick, loading = false }: TutorCalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);

  const today = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }, []);

  // Group lessons by date
  const lessonsByDate = useMemo(() => {
    const map = new Map<string, LessonPlanTutor[]>();
    
    lessons.forEach((lesson) => {
      if (lesson.date_of_lesson) {
        const existing = map.get(lesson.date_of_lesson) || [];
        map.set(lesson.date_of_lesson, [...existing, lesson]);
      }
    });
    
    return map;
  }, [lessons]);

  // Get calendar days for current month
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const startPadding = firstDay.getDay();
    const endPadding = 6 - lastDay.getDay();
    
    const days: Date[] = [];
    
    // Previous month days
    for (let i = startPadding - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);
      days.push(date);
    }
    
    // Current month days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    
    // Next month days
    for (let i = 1; i <= endPadding; i++) {
      days.push(new Date(year, month + 1, i));
    }
    
    return days;
  }, [currentDate]);

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(null);
    setSelectedLessonId(null);
  };

  const formatDateKey = (date: Date): string => {
    return date.toISOString().split("T")[0];
  };

  const isToday = (date: Date): boolean => {
    return formatDateKey(date) === formatDateKey(today);
  };

  const isCurrentMonth = (date: Date): boolean => {
    return date.getMonth() === currentDate.getMonth();
  };

  const isPastDate = (date: Date): boolean => {
    const dateOnly = new Date(date);
    dateOnly.setHours(0, 0, 0, 0);
    return dateOnly < today;
  };

  const isSelectedDate = (date: Date): boolean => {
    if (!selectedDate) return false;
    return formatDateKey(date) === formatDateKey(selectedDate);
  };

  const getLessonsForDate = (date: Date) => {
    return lessonsByDate.get(formatDateKey(date)) || [];
  };

  const selectedDateLessons = useMemo(() => {
    if (!selectedDate) return [];
    return getLessonsForDate(selectedDate);
  }, [selectedDate, lessonsByDate]);

  // Stats for current month
  const monthStats = useMemo(() => {
    const monthLessons = lessons.filter((l) => {
      if (!l.date_of_lesson) return false;
      const lessonDate = new Date(l.date_of_lesson);
      return (
        lessonDate.getMonth() === currentDate.getMonth() &&
        lessonDate.getFullYear() === currentDate.getFullYear()
      );
    });

    const upcomingCount = monthLessons.filter((l) => {
      const lessonDate = new Date(l.date_of_lesson!);
      return lessonDate >= today;
    }).length;

    const completedCount = monthLessons.filter((l) => {
      const lessonDate = new Date(l.date_of_lesson!);
      return lessonDate < today;
    }).length;

    // Count unique students
    const uniqueStudents = new Set(
      monthLessons.map((l) => `${l.first_name ?? ""} ${l.last_name ?? ""}`.trim())
    );

    return {
      total: monthLessons.length,
      upcoming: upcomingCount,
      completed: completedCount,
      students: uniqueStudents.size,
    };
  }, [lessons, currentDate, today]);

  const getSubjectColor = (subject?: string): string => {
    if (!subject) return "bg-gray-500";
    
    const colors: Record<string, string> = {
      Mathematics: "bg-blue-500",
      English: "bg-red-500",
      Science: "bg-green-500",
      History: "bg-yellow-500",
      Geography: "bg-teal-500",
      Physics: "bg-purple-500",
      Chemistry: "bg-pink-500",
      Biology: "bg-emerald-500",
      "Computer Science": "bg-indigo-500",
      Art: "bg-rose-500",
      Music: "bg-amber-500",
    };
    
    return colors[subject] || "bg-gray-500";
  };

  const getStudentInitials = (firstName?: string, lastName?: string): string => {
    const first = firstName?.charAt(0)?.toUpperCase() || "";
    const last = lastName?.charAt(0)?.toUpperCase() || "";
    return first + last || "?";
  };

  const handleLessonClick = (lesson: LessonPlanTutor) => {
    setSelectedLessonId(lesson.id);
    onLessonClick(lesson);
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-12 bg-muted rounded-lg" />
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 35 }).map((_, i) => (
            <div key={i} className="h-24 bg-muted rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <CalendarIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">
                {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <p className="text-sm text-muted-foreground">
                {monthStats.total} lesson{monthStats.total !== 1 ? "s" : ""} • {monthStats.students} student{monthStats.students !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateMonth("prev")}
              className="h-9 w-9"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={goToToday} className="h-9">
              Today
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateMonth("next")}
              className="h-9 w-9"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-1">Total</p>
            <p className="text-xl font-bold">{monthStats.total}</p>
          </div>
          <div className="bg-blue-500/10 rounded-lg p-3">
            <p className="text-xs text-blue-700 dark:text-blue-400 mb-1">Upcoming</p>
            <p className="text-xl font-bold text-blue-700 dark:text-blue-400">
              {monthStats.upcoming}
            </p>
          </div>
          <div className="bg-green-500/10 rounded-lg p-3">
            <p className="text-xs text-green-700 dark:text-green-400 mb-1">Completed</p>
            <p className="text-xl font-bold text-green-700 dark:text-green-400">
              {monthStats.completed}
            </p>
          </div>
          <div className="bg-purple-500/10 rounded-lg p-3">
            <p className="text-xs text-purple-700 dark:text-purple-400 mb-1">Students</p>
            <p className="text-xl font-bold text-purple-700 dark:text-purple-400">
              {monthStats.students}
            </p>
          </div>
        </div>
      </Card>

      {/* Calendar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Calendar */}
        <Card className="lg:col-span-2 p-4">
          <motion.div
            key={`${currentDate.getMonth()}-${currentDate.getFullYear()}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {DAYS_OF_WEEK.map((day) => (
                <div
                  key={day}
                  className="text-center font-semibold text-xs py-2 text-muted-foreground"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((date, index) => {
                const dayLessons = getLessonsForDate(date);
                const isCurrentMonthDay = isCurrentMonth(date);
                const isTodayDate = isToday(date);
                const isPast = isPastDate(date);
                const isSelected = isSelectedDate(date);
                const hasLessons = dayLessons.length > 0;

                return (
                  <motion.button
                    key={`${formatDateKey(date)}-${index}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2, delay: index * 0.01 }}
                    onClick={() => {
                      setSelectedDate(date);
                      setSelectedLessonId(null);
                    }}
                    className={cn(
                      "aspect-square p-1 rounded-lg border transition-all duration-200",
                      "hover:border-primary/50 hover:bg-accent/30 hover:scale-105",
                      "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                      !isCurrentMonthDay && "opacity-40",
                      isSelected && "ring-2 ring-primary bg-primary/10",
                      isTodayDate && !isSelected && "border-primary border-2",
                      isPast && !isTodayDate && "opacity-60",
                      !hasLessons && "border-border"
                    )}
                  >
                    <div className="flex flex-col items-center justify-center h-full">
                      <span
                        className={cn(
                          "text-sm font-medium mb-1",
                          isTodayDate && "text-primary font-bold",
                          !isCurrentMonthDay && "text-muted-foreground"
                        )}
                      >
                        {date.getDate()}
                      </span>
                      {hasLessons && (
                        <div className="flex gap-0.5 flex-wrap justify-center">
                          {dayLessons.slice(0, 3).map((lesson, idx) => (
                            <div
                              key={`${lesson.id}-${idx}`}
                              className={cn(
                                "w-1.5 h-1.5 rounded-full",
                                getSubjectColor(lesson.subject)
                              )}
                              title={`${lesson.first_name} ${lesson.last_name} - ${lesson.topic}`}
                            />
                          ))}
                          {dayLessons.length > 3 && (
                            <span className="text-[8px] text-muted-foreground ml-0.5">
                              +{dayLessons.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </Card>

        {/* Selected Day Details */}
        <Card className="p-4 h-fit">
          <AnimatePresence mode="wait">
            {selectedDate ? (
              <motion.div
                key={formatDateKey(selectedDate)}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {DAYS_OF_WEEK_FULL[selectedDate.getDay()]}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedDate.toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <Badge variant="secondary">
                    {selectedDateLessons.length} lesson{selectedDateLessons.length !== 1 ? "s" : ""}
                  </Badge>
                </div>

                {selectedDateLessons.length > 0 ? (
                  <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                    {selectedDateLessons.map((lesson, idx) => {
                      const isSelected = selectedLessonId === lesson.id;
                      
                      return (
                        <motion.button
                          key={lesson.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          onClick={() => handleLessonClick(lesson)}
                          className={cn(
                            "w-full text-left p-3 rounded-lg border-2 transition-all duration-200",
                            "hover:border-primary/60 hover:bg-accent/50 hover:scale-[1.02]",
                            "active:scale-[0.98]",
                            isSelected 
                              ? "border-primary bg-primary/5 shadow-sm" 
                              : "border-border hover:shadow-sm"
                          )}
                        >
                          <div className="flex items-start gap-3">
                            <Avatar className="h-8 w-8 flex-shrink-0">
                              <AvatarFallback className="text-xs">
                                {getStudentInitials(lesson.first_name, lesson.last_name)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm truncate">{lesson.topic}</h4>
                              <p className="text-xs text-muted-foreground mt-1">
                                {lesson.first_name} {lesson.last_name}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <div
                                  className={cn(
                                    "w-2 h-2 rounded-full",
                                    getSubjectColor(lesson.subject)
                                  )}
                                />
                                <p className="text-xs text-muted-foreground">
                                  {lesson.subject}
                                  {lesson.exam_board && ` • ${lesson.exam_board}`}
                                </p>
                              </div>
                              {lesson.objectives && (
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                  {lesson.objectives}
                                </p>
                              )}
                            </div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <User className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No lessons scheduled</p>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-12 text-muted-foreground"
              >
                <CalendarIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Select a date to view lessons</p>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </div>

      {/* Legend */}
      <Card className="p-4">
        <h3 className="font-semibold text-sm mb-3">Legend</h3>
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border-2 border-primary" />
            <span className="text-muted-foreground">Today</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded ring-2 ring-primary bg-primary/10" />
            <span className="text-muted-foreground">Selected Date</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border-2 border-primary bg-primary/5" />
            <span className="text-muted-foreground">Selected Lesson</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
            </div>
            <span className="text-muted-foreground">Has lessons (dots represent students)</span>
          </div>
        </div>
      </Card>
    </div>
  );
}