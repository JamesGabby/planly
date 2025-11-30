// components/TutorStudentProfileFiltersCard.tsx
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
  Search,
  Filter,
  X,
  ChevronDown,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ModeSwitcher } from "@/components/ModeSwitcher";

export interface TutorStudentProfileFilterState {
  search: string;
  selectedStudent: string;
  selectedLevel: string;
}

interface TutorStudentProfileFiltersCardProps {
  search: string;
  setSearch: (value: string) => void;
  selectedStudent: string;
  setSelectedStudent: (value: string) => void;
  selectedLevel: string;
  setSelectedLevel: (value: string) => void;
  students: string[];
  levels: string[];
  onFiltersChange?: (filters: Partial<TutorStudentProfileFilterState>) => void;
}

export function TutorStudentProfileFiltersCard({
  search,
  setSearch,
  selectedStudent,
  setSelectedStudent,
  selectedLevel,
  setSelectedLevel,
  students,
  levels,
  onFiltersChange,
}: TutorStudentProfileFiltersCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Count active filters (excluding search)
  const activeFilterCount = [selectedStudent, selectedLevel].filter(Boolean).length;

  const handleClearAll = () => {
    setSearch("");
    setSelectedStudent("");
    setSelectedLevel("");
    onFiltersChange?.({
      search: "",
      selectedStudent: "",
      selectedLevel: "",
    });
  };

  return (
    <div className="space-y-4">
      {/* Primary Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <ModeSwitcher />

        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, level, goals, strengths, interests..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 pr-10"
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
            className="shrink-0 h-10"
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
            <Button variant="ghost" onClick={handleClearAll} className="shrink-0 h-10">
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
          {selectedLevel && (
            <Badge variant="secondary" className="pl-3 pr-1">
              Level: {selectedLevel}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-1.5 hover:bg-transparent"
                onClick={() => setSelectedLevel("")}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Student Filter */}
                <div className="space-y-2">
                  <Label htmlFor="student-filter">Student Name</Label>
                  <Select
                    value={selectedStudent || undefined}
                    onValueChange={(value) =>
                      setSelectedStudent(value === "all-students" ? "" : value)
                    }
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

                {/* Level Filter */}
                {levels.length > 0 && (
                  <div className="space-y-2">
                    <Label htmlFor="level-filter">Level</Label>
                    <Select
                      value={selectedLevel || undefined}
                      onValueChange={(value) =>
                        setSelectedLevel(value === "all-levels" ? "" : value)
                      }
                    >
                      <SelectTrigger id="level-filter">
                        <SelectValue placeholder="All Levels" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all-levels">All Levels</SelectItem>
                        {levels.map((level) => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}