// components/TutorFiltersCard.tsx
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Search,
  Filter,
  X,
  Calendar as CalendarIcon,
  ChevronDown,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ModeSwitcher } from "@/components/ModeSwitcher";

export interface TutorFilterState {
  search: string;
  selectedStudent: string;
  dateFilter: string;
  subject: string;
  examBoard: string;
  dateRange: { from: Date | undefined; to: Date | undefined };
}

interface TutorFiltersCardProps {
  search: string;
  setSearch: (value: string) => void;
  selectedStudent: string;
  setSelectedStudent: (value: string) => void;
  dateFilter: string;
  setDateFilter: (value: string) => void;
  students: string[];
  subjects?: string[];
  examBoards?: string[];
  onFiltersChange?: (filters: Partial<TutorFilterState>) => void;
}

export function LessonTutorFiltersCard({
  search,
  setSearch,
  selectedStudent,
  setSelectedStudent,
  dateFilter,
  setDateFilter,
  students,
  subjects = [],
  examBoards = [],
  onFiltersChange,
}: TutorFiltersCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedExamBoard, setSelectedExamBoard] = useState<string>("");
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({ from: undefined, to: undefined });

  // Count active filters (excluding search)
  const activeFilterCount = [
    selectedStudent,
    dateFilter,
    selectedSubject,
    selectedExamBoard,
    dateRange.from,
  ].filter(Boolean).length;

  const handleClearAll = () => {
    setSearch("");
    setSelectedStudent("");
    setDateFilter("");
    setSelectedSubject("");
    setSelectedExamBoard("");
    setDateRange({ from: undefined, to: undefined });
    onFiltersChange?.({
      search: "",
      selectedStudent: "",
      dateFilter: "",
      subject: "",
      examBoard: "",
      dateRange: { from: undefined, to: undefined },
    });
  };

  const handleQuickDateFilter = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    setDateFilter(date.toISOString().split("T")[0]);
  };

  return (
    <div className="space-y-4">
      {/* Primary Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <ModeSwitcher />
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by topic, objectives, or student..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-10"
          />
          {search && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
              onClick={() => setSearch("")}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            variant={activeFilterCount > 0 ? "default" : "outline"}
            onClick={() => setIsExpanded(!isExpanded)}
            className="shrink-0"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-2 rounded-full px-2">
                {activeFilterCount}
              </Badge>
            )}
            <ChevronDown
              className={cn(
                "h-4 w-4 ml-2 transition-transform",
                isExpanded && "rotate-180"
              )}
            />
          </Button>

          {activeFilterCount > 0 && (
            <Button variant="ghost" onClick={handleClearAll} className="shrink-0">
              <RotateCcw className="h-4 w-4 mr-2" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Active Filters Pills */}
      {activeFilterCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-2"
        >
          {selectedStudent && (
            <Badge variant="secondary" className="pl-3 pr-1">
              Student: {selectedStudent}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-1.5 hover:bg-transparent"
                onClick={() => setSelectedStudent("")}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {selectedSubject && (
            <Badge variant="secondary" className="pl-3 pr-1">
              Subject: {selectedSubject}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-1.5 hover:bg-transparent"
                onClick={() => setSelectedSubject("")}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {selectedExamBoard && (
            <Badge variant="secondary" className="pl-3 pr-1">
              Exam Board: {selectedExamBoard}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-1.5 hover:bg-transparent"
                onClick={() => setSelectedExamBoard("")}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {dateFilter && (
            <Badge variant="secondary" className="pl-3 pr-1">
              Date: {format(new Date(dateFilter), "MMM dd, yyyy")}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-1.5 hover:bg-transparent"
                onClick={() => setDateFilter("")}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {dateRange.from && (
            <Badge variant="secondary" className="pl-3 pr-1">
              Range: {format(dateRange.from, "MMM dd")}
              {dateRange.to && ` - ${format(dateRange.to, "MMM dd")}`}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-1.5 hover:bg-transparent"
                onClick={() => setDateRange({ from: undefined, to: undefined })}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
        </motion.div>
      )}

      {/* Advanced Filters Panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border rounded-lg p-6 bg-card space-y-6">
              {/* Quick Date Filters */}
              <div>
                <Label className="text-sm font-medium mb-3 block">
                  Quick Date Filter
                </Label>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={dateFilter === new Date().toISOString().split("T")[0] ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleQuickDateFilter(0)}
                  >
                    Today
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickDateFilter(1)}
                  >
                    Tomorrow
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickDateFilter(7)}
                  >
                    Next Week
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickDateFilter(30)}
                  >
                    Next Month
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Student Filter */}
                <div className="space-y-2">
                  <Label htmlFor="student-filter">Student</Label>
                  <Select 
                    value={selectedStudent || undefined} 
                    onValueChange={(value) => setSelectedStudent(value === "all-students" ? "" : value)}
                  >
                    <SelectTrigger id="student-filter">
                      <SelectValue placeholder="All Students" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-students">All Students</SelectItem>
                      {students.map((student) => (
                        <SelectItem key={student} value={student}>
                          {student}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Subject Filter */}
                {subjects.length > 0 && (
                  <div className="space-y-2">
                    <Label htmlFor="subject-filter">Subject</Label>
                    <Select
                      value={selectedSubject || undefined}
                      onValueChange={(value) => setSelectedSubject(value === "all-subjects" ? "" : value)}
                    >
                      <SelectTrigger id="subject-filter">
                        <SelectValue placeholder="All Subjects" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all-subjects">All Subjects</SelectItem>
                        {subjects.map((subject) => (
                          <SelectItem key={subject} value={subject}>
                            {subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Exam Board Filter */}
                {examBoards.length > 0 && (
                  <div className="space-y-2">
                    <Label htmlFor="exam-board-filter">Exam Board</Label>
                    <Select
                      value={selectedExamBoard || undefined}
                      onValueChange={(value) => setSelectedExamBoard(value === "all-boards" ? "" : value)}
                    >
                      <SelectTrigger id="exam-board-filter">
                        <SelectValue placeholder="All Exam Boards" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all-boards">All Exam Boards</SelectItem>
                        {examBoards.map((board) => (
                          <SelectItem key={board} value={board}>
                            {board}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Specific Date Filter */}
                <div className="space-y-2">
                  <Label>Specific Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !dateFilter && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateFilter
                          ? format(new Date(dateFilter), "PPP")
                          : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dateFilter ? new Date(dateFilter) : undefined}
                        onSelect={(date) =>
                          setDateFilter(date ? date.toISOString().split("T")[0] : "")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Date Range Filter */}
                <div className="space-y-2">
                  <Label>Date Range</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !dateRange.from && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange.from ? (
                          dateRange.to ? (
                            <>
                              {format(dateRange.from, "LLL dd")} -{" "}
                              {format(dateRange.to, "LLL dd, y")}
                            </>
                          ) : (
                            format(dateRange.from, "LLL dd, y")
                          )
                        ) : (
                          "Pick date range"
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="range"
                        selected={{
                          from: dateRange.from,
                          to: dateRange.to,
                        }}
                        onSelect={(range) =>
                          setDateRange({
                            from: range?.from,
                            to: range?.to,
                          })
                        }
                        numberOfMonths={2}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}