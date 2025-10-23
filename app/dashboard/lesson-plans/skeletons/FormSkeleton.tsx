import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Separator } from "@radix-ui/react-dropdown-menu";

export function FormSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 p-6 md:p-10 animate-pulse">
      <div className="max-w-5xl mx-auto">
        <Card className="border shadow-md rounded-2xl bg-card/90 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <div className="h-7 w-48 bg-muted rounded mb-2" />
            <div className="h-4 w-72 bg-muted rounded" />
          </CardHeader>

          <CardContent className="mt-6 space-y-8">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-24 bg-muted rounded" />
                  <div className="h-10 w-full bg-muted rounded" />
                </div>
              ))}
            </div>

            <Separator className="my-8" />

            {/* Objectives & Outcomes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-24 bg-muted rounded" />
                  <div className="h-32 w-full bg-muted rounded" />
                </div>
              ))}
            </div>

            <Separator className="my-8" />

            {/* Lesson Structure */}
            <div>
              <div className="h-5 w-48 bg-muted rounded mb-4" />
              <div className="space-y-5">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="border border-border/50 rounded-xl bg-card/50 p-5 shadow-sm"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <div className="h-4 w-32 bg-muted rounded" />
                      <div className="h-6 w-16 bg-muted rounded" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      <div>
                        <div className="h-4 w-20 bg-muted rounded mb-2" />
                        <div className="h-10 w-full bg-muted rounded" />
                      </div>
                      <div className="md:col-span-4 grid grid-cols-1 md:grid-cols-4 gap-3">
                        {[...Array(4)].map((_, j) => (
                          <div key={j}>
                            <div className="h-4 w-20 bg-muted rounded mb-2" />
                            <div className="h-16 w-full bg-muted rounded" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}

                <div className="h-9 w-32 bg-muted rounded mt-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
