"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

export default function StudentProfileSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/50 to-background">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 md:p-8 space-y-6">
        
        {/* Back Button */}
        <div>
          <Skeleton className="h-5 w-32 rounded" />
        </div>

        {/* Header Card */}
        <Card className="border-border/50 shadow-sm bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex items-start gap-4">
                
                {/* Avatar */}
                <Skeleton className="h-16 w-16 rounded-full" />

                {/* Name */}
                <div className="space-y-2 w-full max-w-sm">
                  <Skeleton className="h-6 w-48 rounded" />
                  <Skeleton className="h-4 w-32 rounded" />
                </div>
              </div>

              {/* Edit Button Placeholder */}
              <Skeleton className="h-9 w-28 rounded" />
            </div>
          </CardHeader>
        </Card>

        {/* Section Title */}
        <SectionTitleSkeleton />

        {/* Overview Fields */}
        <GridSkeleton columns={3} count={3} />

        <SeparatorSkeleton />

        {/* Learning Style */}
        <SectionTitleSkeleton />
        <GridSkeleton columns={2} count={2} />

        <SeparatorSkeleton />

        {/* Assessment */}
        <SectionTitleSkeleton />
        <GridSkeleton columns={2} count={3} />

      </div>
    </div>
  );
}

/* ---------------------- Reusable UI Skeletons ---------------------- */

function SectionTitleSkeleton() {
  return (
    <div className="flex items-center gap-2">
      <Skeleton className="h-8 w-1 rounded-full" />
      <Skeleton className="h-6 w-40 rounded" />
    </div>
  );
}

function SeparatorSkeleton() {
  return <Skeleton className="h-[1px] w-full opacity-50" />;
}

/**
 * Creates a responsive grid skeleton that matches the real layout.
 * columns: number of columns on desktop
 * count: number of items to show
 */
function GridSkeleton({ columns, count }: { columns: number; count: number }) {
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns} gap-4`}
    >
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="border-border/40">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8 rounded-lg" />
                <CardTitle>
                  <Skeleton className="h-5 w-28 rounded" />
                </CardTitle>
              </div>
              <Skeleton className="h-5 w-16 rounded" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-20 w-full rounded" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
