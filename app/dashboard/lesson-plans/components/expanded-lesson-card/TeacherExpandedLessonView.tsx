"use client";

import { LessonPlanTeacher } from "../../types/lesson_teacher";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { parseResources, prettyDate, prettyTime } from "../../utils/helpers";
import {
  GraduationCap,
  Calendar,
  Clock,
  Printer,
  Target,
  Award,
  BookOpen,
  Brain,
  Calculator,
  FileText,
  Shield,
  Lightbulb,
  Package,
  ClipboardList,
  StickyNote,
  CheckCircle2,
  ExternalLink
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Component to format content with bullets and bold text
function FormattedContent({ content }: { content: string | null | undefined }) {
  // Handle null, undefined, or non-string content
  if (!content || typeof content !== 'string') return null;

  // Parse bullet points and bold text
  const parts = content.split(/•\s+/).filter(item => item.trim());

  if (parts.length <= 1) {
    // No bullet points, just format the text
    return (
      <div
        className="whitespace-pre-wrap leading-relaxed"
        dangerouslySetInnerHTML={{
          __html: content
            .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>')
            .replace(/\n/g, '<br />')
        }}
      />
    );
  }

  // Has bullet points
  return (
    <ul className="space-y-2">
      {parts.map((item, idx) => (
        <li key={idx} className="flex gap-3 items-start">
          <span className="text-primary mt-1.5 flex-shrink-0 font-bold">•</span>
          <span
            className="flex-1"
            dangerouslySetInnerHTML={{
              __html: item
                .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>')
                .replace(/\n/g, '<br />')
            }}
          />
        </li>
      ))}
    </ul>
  );
}

// Info card component for consistent styling
function InfoCard({
  icon: Icon,
  title,
  content,
  iconColor = "text-primary"
}: {
  icon: React.ElementType;
  title: string;
  content: string | null | undefined;
  iconColor?: string;
}) {
  // Don't render if content is empty
  if (!content) return null;

  return (
    <div className="rounded-lg border border-border bg-card p-4 sm:p-5 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-start gap-3">
        <div className={`${iconColor} mt-1 flex-shrink-0`}>
          <Icon size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-foreground mb-2 text-sm sm:text-base">{title}</h4>
          <div className="text-sm text-muted-foreground">
            <FormattedContent content={content} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function DetailedExpandedLessonView({ lesson }: { lesson: LessonPlanTeacher }) {
  const supabase = createClient();
  const [classId, setClassId] = useState<string | null>(null);

  const resources = parseResources(lesson.resources);
  const lessonStructure = Array.isArray(lesson.lesson_structure)
    ? lesson.lesson_structure
    : [];

  // Fetch the class_id based on class_name and user_id
  useEffect(() => {
    async function fetchClassId() {
      if (!lesson.class || !lesson.user_id) return;

      try {
        const { data, error } = await supabase
          .from("classes")
          .select("class_id")
          .eq("class_name", lesson.class)
          .eq("user_id", lesson.user_id)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        if (data) {
          setClassId(data.class_id);
        } else {
          const { data: anyClassData, error: anyClassError } = await supabase
            .from("classes")
            .select("class_id")
            .eq("class_name", lesson.class)
            .limit(1)
            .maybeSingle();

          if (anyClassError && anyClassError.code !== 'PGRST116') {
            throw anyClassError;
          }

          if (anyClassData) {
            setClassId(anyClassData.class_id);
          }
        }
      } catch (err) {
        console.error("Error fetching class ID:", err);
      }
    }

    fetchClassId();
  }, [lesson.class, lesson.user_id, supabase]);

  const handlePrint = () => {
    const printElement = document.getElementById('lesson-print');
    if (!printElement) return;

    const clone = printElement.cloneNode(true) as HTMLElement;

    // Transform the structure for print
    const stageBlocks = clone.querySelectorAll('.rounded-lg.border');
    stageBlocks.forEach(block => {
      block.classList.add('stage-block');
    });

    const newWindow = window.open('', '', 'width=800,height=600');
    if (!newWindow) return;

    newWindow.document.write(`
    <html>
      <head>
        <title>Lesson Plan - ${lesson.topic || 'Untitled'}</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 30px;
            color: #1a1a1a;
            background: #fff;
            line-height: 1.6;
          }
          h2 { 
            color: #2563eb; 
            border-bottom: 3px solid #2563eb;
            padding-bottom: 10px;
            margin-bottom: 20px;
          }
          h3 { 
            color: #1e40af; 
            margin-top: 25px;
            margin-bottom: 15px;
            font-size: 1.3em;
          }
          h4 {
            color: #334155;
            margin-bottom: 8px;
            font-size: 1.1em;
          }
          h5 {
            color: #475569;
            font-size: 0.95em;
            margin-top: 12px;
            margin-bottom: 6px;
          }
          .stage-block, .info-card {
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
            background: #f8fafc;
          }
          .info-card {
            page-break-inside: avoid;
          }
          .stage-header {
            background: #e0e7ff;
            padding: 15px;
            border-radius: 6px 6px 0 0;
            margin: -20px -20px 15px -20px;
            border-bottom: 2px solid #cbd5e1;
          }
          .grid-2 {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-top: 15px;
          }
          .content-section {
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 1px solid #e2e8f0;
          }
          .content-section:last-child {
            border-bottom: none;
          }
          ul {
            list-style: none;
            padding-left: 0;
            margin: 8px 0;
          }
          li {
            margin-bottom: 8px;
            padding-left: 0;
          }
          strong {
            color: #1e293b;
            font-weight: 600;
          }
          button, input, textarea {
            display: none !important;
          }
          .meta-info {
            background: #f1f5f9;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
          }
          .meta-info > div {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 12px;
          }
          .meta-info a,
          .meta-info span {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            margin-right: 8px;
          }
          .meta-info svg {
            flex-shrink: 0;
          }
          .objectives-outcomes {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 25px;
          }
          .section-icon {
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            margin-right: 8px;
          }
          .icon-blue { background: #3b82f6; }
          .icon-green { background: #10b981; }
          .icon-amber { background: #f59e0b; }
          .icon-purple { background: #8b5cf6; }
          .lesson-structure-section {
            page-break-before: always;
          }
          .lesson-structure-section h3 {
            margin-top: 0;
            page-break-after: avoid;
          }
          @media print {
            .info-card {
              page-break-inside: avoid;
            }
            body {
              margin: 15px;
            }
            .objectives-outcomes {
              grid-template-columns: 1fr;
            }
            .meta-info > div {
              gap: 15px;
            }
          }
        </style>
      </head>
      <body>
        ${clone.outerHTML}
      </body>
    </html>
  `);

    newWindow.document.close();
    newWindow.focus();
    newWindow.print();
    newWindow.close();
  };

  return (
    <div id="lesson-print" className="ExpandedLessonView max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6 sm:space-y-8">
      {/* --- HEADER --- */}
      <header className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
            {lesson.topic ?? "Untitled"}
          </h2>
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Link
              href={`/dashboard/lesson-plans/lesson/teacher/${lesson.id}`}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors shadow-sm border border-border"
            >
              <ExternalLink size={18} />
              <span>View</span>
            </Link>
            <Button
              onClick={handlePrint}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
            >
              <Printer size={18} />
              <span>Print / Export PDF</span>
            </Button>
          </div>
        </div>

        {/* Meta Information Card */}
        <div className="meta-info rounded-lg border border-border bg-card p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 sm:gap-x-4 sm:gap-y-2 text-sm">
            <span className="flex items-center gap-2 font-medium">
              <GraduationCap size={18} className="text-primary flex-shrink-0" />
            </span>
            {classId ? (
              <Link
                href={`/dashboard/classes/${classId}`}
                className="text-primary hover:underline hover:text-primary/80 transition-colors font-medium truncate"
              >
                {lesson.class}
              </Link>
            ) : (
              <span className="font-medium truncate">{lesson.class}</span>
            )}
            <span className="hidden sm:inline text-muted-foreground">•</span>
            <span className="truncate">{lesson.year_group}</span>
            {lesson.exam_board && (
              <>
                <span className="hidden sm:inline text-muted-foreground">•</span>
                <span className="text-muted-foreground truncate">{lesson.exam_board}</span>
              </>
            )}
            <div className="flex flex-col sm:flex-row sm:ml-auto gap-2 sm:gap-4 w-full sm:w-auto">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Calendar size={16} className="flex-shrink-0" />
                <span className="truncate">{prettyDate(lesson.date_of_lesson)}</span>
              </span>
              {lesson.time_of_lesson && (
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Clock size={16} className="flex-shrink-0" />
                  <span className="truncate">{prettyTime(lesson.time_of_lesson)}</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* --- OBJECTIVES & OUTCOMES --- */}
      {(lesson.objectives || lesson.outcomes) && (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lesson.objectives && (
            <div className="rounded-lg border border-border bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/10 p-4 sm:p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <Target className="text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" size={22} />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-base sm:text-lg text-foreground mb-3">Objectives</h3>
                  <div className="text-sm text-muted-foreground">
                    <FormattedContent content={lesson.objectives} />
                  </div>
                </div>
              </div>
            </div>
          )}
          {lesson.outcomes && (
            <div className="rounded-lg border border-border bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/20 dark:to-green-900/10 p-4 sm:p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <Award className="text-green-600 dark:text-green-400 mt-1 flex-shrink-0" size={22} />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-base sm:text-lg text-foreground mb-3">Outcomes</h3>
                  <div className="text-sm text-muted-foreground">
                    <FormattedContent content={lesson.outcomes} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* --- LESSON STRUCTURE --- */}
      {lessonStructure.length > 0 && (
        <section className="lesson-structure-section">
          <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            <BookOpen className="text-primary flex-shrink-0" size={24} />
            <span>Lesson Structure</span>
          </h3>
          <div className="space-y-4">
            {lessonStructure.map((stage, i) => (
              <div
                key={i}
                className="rounded-lg border border-border bg-card shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                {/* Stage Header */}
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-4 border-b border-border">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-base sm:text-lg font-semibold text-foreground truncate">
                        {stage.stage}
                      </h4>
                      {stage.duration && (
                        <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                          <Clock size={14} className="flex-shrink-0" />
                          <span>{stage.duration}</span>
                        </p>
                      )}
                    </div>
                    <span className="text-xs font-medium px-3 py-1 rounded-full bg-primary/20 text-primary w-fit whitespace-nowrap">
                      Stage {i + 1} of {lessonStructure.length}
                    </span>
                  </div>
                </div>

                {/* Stage Content */}
                <div className="p-4 sm:p-6">
                  <div className="space-y-5">
                    {/* Teaching */}
                    {stage.teaching && (
                      <div className="space-y-2">
                        <h5 className="font-semibold text-sm text-foreground flex items-center gap-2 pb-2 border-b border-border">
                          <span className="w-3 h-3 rounded-full bg-blue-500 flex-shrink-0"></span>
                          <span>Teaching Activities</span>
                        </h5>
                        <div className="text-sm text-muted-foreground pl-5">
                          <FormattedContent content={stage.teaching} />
                        </div>
                      </div>
                    )}

                    {/* Learning */}
                    {stage.learning && (
                      <div className="space-y-2">
                        <h5 className="font-semibold text-sm text-foreground flex items-center gap-2 pb-2 border-b border-border">
                          <span className="w-3 h-3 rounded-full bg-green-500 flex-shrink-0"></span>
                          <span>Student Learning</span>
                        </h5>
                        <div className="text-sm text-muted-foreground pl-5">
                          <FormattedContent content={stage.learning} />
                        </div>
                      </div>
                    )}

                    {/* Assessing */}
                    {stage.assessing && (
                      <div className="space-y-2">
                        <h5 className="font-semibold text-sm text-foreground flex items-center gap-2 pb-2 border-b border-border">
                          <span className="w-3 h-3 rounded-full bg-amber-500 flex-shrink-0"></span>
                          <span>Assessment Methods</span>
                        </h5>
                        <div className="text-sm text-muted-foreground pl-5">
                          <FormattedContent content={stage.assessing} />
                        </div>
                      </div>
                    )}

                    {/* Adapting */}
                    {stage.adapting && (
                      <div className="space-y-2">
                        <h5 className="font-semibold text-sm text-foreground flex items-center gap-2 pb-2 border-b border-border">
                          <span className="w-3 h-3 rounded-full bg-purple-500 flex-shrink-0"></span>
                          <span>Differentiation & Adaptation</span>
                        </h5>
                        <div className="text-sm text-muted-foreground pl-5">
                          <FormattedContent content={stage.adapting} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
      {/* --- ADDITIONAL INFORMATION GRID --- */}
      {(lesson.specialist_subject_knowledge_required ||
        lesson.knowledge_revisited ||
        lesson.numeracy_opportunities ||
        lesson.literacy_opportunities ||
        lesson.subject_pedagogies ||
        lesson.health_and_safety_considerations) && (
          <section>
            <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Lightbulb className="text-primary flex-shrink-0" size={24} />
              <span>Additional Details</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lesson.specialist_subject_knowledge_required && (
                <InfoCard
                  icon={Brain}
                  title="Specialist Subject Knowledge"
                  content={lesson.specialist_subject_knowledge_required}
                  iconColor="text-purple-600 dark:text-purple-400"
                />
              )}

              {lesson.knowledge_revisited && (
                <InfoCard
                  icon={BookOpen}
                  title="Knowledge Revisited"
                  content={lesson.knowledge_revisited}
                  iconColor="text-blue-600 dark:text-blue-400"
                />
              )}

              {lesson.numeracy_opportunities && (
                <InfoCard
                  icon={Calculator}
                  title="Numeracy Opportunities"
                  content={lesson.numeracy_opportunities}
                  iconColor="text-green-600 dark:text-green-400"
                />
              )}

              {lesson.literacy_opportunities && (
                <InfoCard
                  icon={FileText}
                  title="Literacy Opportunities"
                  content={lesson.literacy_opportunities}
                  iconColor="text-amber-600 dark:text-amber-400"
                />
              )}

              {lesson.subject_pedagogies && (
                <InfoCard
                  icon={Lightbulb}
                  title="Subject Pedagogies"
                  content={lesson.subject_pedagogies}
                  iconColor="text-pink-600 dark:text-pink-400"
                />
              )}

              {lesson.health_and_safety_considerations && (
                <InfoCard
                  icon={Shield}
                  title="Health & Safety"
                  content={lesson.health_and_safety_considerations}
                  iconColor="text-red-600 dark:text-red-400"
                />
              )}
            </div>
          </section>
        )}

      {/* --- RESOURCES --- */}
      {resources.length > 0 && (
        <section>
          <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Package className="text-primary flex-shrink-0" size={24} />
            <span>Resources</span>
          </h3>
          <div className="rounded-lg border border-border bg-card p-4 sm:p-5 shadow-sm">
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {resources.map((r, i) => (
                <li key={i} className="flex items-start gap-2 group">
                  <span className="text-primary mt-1 flex-shrink-0 transition-transform group-hover:translate-x-1">→</span>
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline hover:text-primary/80 transition-colors text-sm break-words"
                  >
                    {r.title || r.url}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* --- HOMEWORK (Read-only) --- */}
      {lesson.homework && (
        <section>
          <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            <ClipboardList className="text-primary flex-shrink-0" size={24} />
            <span>Homework</span>
          </h3>
          <div className="rounded-lg border border-border bg-card p-4 sm:p-5 shadow-sm">
            <div className="text-sm text-muted-foreground">
              <FormattedContent content={lesson.homework} />
            </div>
          </div>
        </section>
      )}

      {/* --- EVALUATION & NOTES (Read-only) --- */}
      <section className="space-y-4 sm:space-y-6">
        {lesson.evaluation && (
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
              <CheckCircle2 className="text-primary flex-shrink-0" size={24} />
              <span>Evaluation</span>
            </h3>
            <div className="rounded-lg border border-border bg-card p-4 sm:p-5 shadow-sm">
              <div className="text-sm text-muted-foreground">
                <FormattedContent content={lesson.evaluation} />
              </div>
            </div>
          </div>
        )}

        {lesson.notes && (
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
              <StickyNote className="text-primary flex-shrink-0" size={24} />
              <span>Notes</span>
            </h3>
            <div className="rounded-lg border border-border bg-card p-4 sm:p-5 shadow-sm">
              <div className="text-sm text-muted-foreground">
                <FormattedContent content={lesson.notes} />
              </div>
            </div>
          </div>
        )}
      </section>

      {/* --- FOOTER METADATA --- */}
      <footer className="pt-6 border-t border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar size={12} className="flex-shrink-0" />
              <span className="truncate">Created: {new Date(lesson.created_at).toLocaleString()}</span>
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1">
              <Clock size={12} className="flex-shrink-0" />
              <span className="truncate">Updated: {new Date(lesson.updated_at).toLocaleString()}</span>
            </span>
          </div>

          <button
            onClick={handlePrint}
            className="sm:hidden inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
          >
            <Printer size={18} />
            <span>Print / Export PDF</span>
          </button>
        </div>
      </footer>
    </div>
  );
}