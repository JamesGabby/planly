"use client";

import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export function LessonCardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
      className="h-full"
    >
      <Card className="bg-card border border-border shadow-sm h-full flex flex-col justify-between">
        {/* Header */}
        <CardHeader className="p-4 sm:p-5 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            {/* Lesson info placeholder */}
            <div className="space-y-2 w-full">
              <Skeleton className="h-5 w-3/4 rounded-md" /> {/* title */}
              <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
                <Skeleton className="h-3 w-16 rounded-md" /> {/* class */}
                <Skeleton className="h-3 w-20 rounded-md" /> {/* date */}
                <Skeleton className="h-3 w-12 rounded-md" /> {/* time */}
              </div>
              <Skeleton className="h-4 w-14 mt-2 rounded-full" /> {/* status */}
            </div>

            {/* Menu button placeholder */}
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        </CardHeader>

        {/* Content */}
        <CardContent className="p-4 sm:p-5 pt-0 space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-3 w-full rounded-md" />
            <Skeleton className="h-3 w-[90%] rounded-md" />
            <Skeleton className="h-3 w-[75%] rounded-md" />
          </div>

          {/* Mobile buttons placeholder */}
          <div className="flex sm:hidden gap-2 mt-2">
            <Skeleton className="h-8 w-16 rounded-md" />
            <Skeleton className="h-8 w-16 rounded-md" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
