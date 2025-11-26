"use client";

import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export function EditLessonFormSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/50 to-background p-4 sm:p-6 md:p-8 lg:p-10 transition-colors">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Header Section Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-8 sm:h-9 w-48 sm:w-64" />
          <Skeleton className="h-4 w-full max-w-2xl" />
        </div>

        <Card className="border-border/50 shadow-sm bg-card/80 backdrop-blur-sm">
          <CardHeader className="border-b border-border/60 pb-3 sm:pb-4 px-4 sm:px-6">
            <Skeleton className="h-6 sm:h-7 w-40" />
          </CardHeader>

          <CardContent className="p-4 sm:p-6 space-y-6 sm:space-y-8">
            {/* Basic Info Section */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Skeleton className="h-8 w-1 rounded-full" />
                <Skeleton className="h-6 w-48" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
            </section>

            {/* AI Generate Button Skeleton */}
            <div className="flex justify-center py-4">
              <Skeleton className="h-11 w-full sm:w-56 rounded-md" />
            </div>

            <Separator />

            {/* Learning Goals Section */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Skeleton className="h-8 w-1 rounded-full" />
                <Skeleton className="h-6 w-40" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex items-center gap-1">
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-4 w-4 rounded-full" />
                    </div>
                    <Skeleton className="h-[120px] w-full rounded-md" />
                  </div>
                ))}
              </div>
            </section>

            <Separator />

            {/* Pedagogical Details Section */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Skeleton className="h-8 w-1 rounded-full" />
                <Skeleton className="h-6 w-52" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex items-center gap-1">
                      <Skeleton className="h-4 w-36" />
                      <Skeleton className="h-4 w-4 rounded-full" />
                    </div>
                    <Skeleton className="h-[100px] w-full rounded-md" />
                  </div>
                ))}
              </div>
            </section>

            <Separator />

            {/* Lesson Structure Section */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Skeleton className="h-8 w-1 rounded-full" />
                <Skeleton className="h-6 w-44" />
              </div>

              <Skeleton className="h-4 w-full max-w-3xl mb-4" />

              <div className="space-y-4">
                {[...Array(2)].map((_, i) => (
                  <div
                    key={i}
                    className="border border-border/60 rounded-xl bg-background/70 shadow-sm overflow-hidden"
                  >
                    {/* Stage Header */}
                    <div className="px-4 py-3 sm:px-5 sm:py-4 border-b border-border/50 bg-muted/30">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                          <Skeleton className="h-6 w-24" />
                          <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-4 w-4 rounded-full" />
                            <Skeleton className="h-7 w-20" />
                          </div>
                        </div>
                        <Skeleton className="h-8 w-20" />
                      </div>
                    </div>

                    {/* Stage Content */}
                    <div className="p-4 sm:p-5 space-y-4">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {[...Array(4)].map((_, j) => (
                          <div key={j} className="space-y-2">
                            <div className="flex items-center gap-1">
                              <Skeleton className="h-4 w-20" />
                              <Skeleton className="h-4 w-4 rounded-full" />
                            </div>
                            <Skeleton className="h-[100px] w-full rounded-md" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}

                <Skeleton className="h-10 w-full sm:w-32 rounded-md" />
              </div>
            </section>

            <Separator />

            {/* Resources Section */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Skeleton className="h-8 w-1 rounded-full" />
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-4 rounded-full" />
              </div>

              <div className="space-y-3">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                    <Skeleton className="h-8 w-full sm:w-40" />
                  </div>
                ))}

                <Skeleton className="h-10 w-full sm:w-40 rounded-md" />
              </div>
            </section>

            <Separator />

            {/* Homework Section */}
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-1 rounded-full" />
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-4 rounded-full" />
              </div>
              <Skeleton className="h-[120px] w-full rounded-md" />
            </section>

            <Separator />

            {/* Evaluation Section */}
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-1 rounded-full" />
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-4 rounded-full" />
              </div>
              <Skeleton className="h-[120px] w-full rounded-md" />
            </section>

            <Separator />

            {/* Notes Section */}
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-1 rounded-full" />
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-4 rounded-full" />
              </div>
              <Skeleton className="h-[120px] w-full rounded-md" />
            </section>

            {/* Submit Button Section */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
              <Skeleton className="h-11 w-full sm:w-24 rounded-md" />
              <Skeleton className="h-11 w-full sm:w-44 rounded-md" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}