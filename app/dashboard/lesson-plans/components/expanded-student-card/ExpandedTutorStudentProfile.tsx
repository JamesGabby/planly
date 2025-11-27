"use client";

import { StudentProfileTutor } from "../../types/student_profile_tutor";
import {
  GraduationCap,
  Printer,
  Target,
  Sparkles,
  BicepsFlexed,
  AlertTriangle,
  BrainCircuit,
  ChartLine,
  FileText,
  Calendar,
  Clock,
  User,
} from "lucide-react";

// Component to format content with bullets and bold text
function FormattedContent({ content }: { content: string }) {
  if (!content) return null;

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
  iconColor = "text-primary",
  highlight = false,
}: {
  icon: React.ElementType;
  title: string;
  content: string;
  iconColor?: string;
  highlight?: boolean;
}) {
  if (!content || content.trim() === "") return null;

  return (
    <div 
      className={`rounded-lg border bg-card p-4 sm:p-5 shadow-sm hover:shadow-md transition-all ${
        highlight ? 'border-yellow-500/70 bg-yellow-50/50 dark:bg-yellow-950/20' : 'border-border'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`${iconColor} mt-1 flex-shrink-0`}>
          <Icon size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className={`font-semibold mb-2 text-sm sm:text-base ${
            highlight ? 'text-yellow-700 dark:text-yellow-300' : 'text-foreground'
          }`}>
            {title}
          </h4>
          <div className={`text-sm ${
            highlight ? 'text-yellow-800 dark:text-yellow-200' : 'text-muted-foreground'
          }`}>
            <FormattedContent content={content} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ExpandedTutorStudentProfileView({ student }: { student: StudentProfileTutor }) {
  const fullName = `${student.first_name ?? ""} ${student.last_name ?? ""}`.trim() || "Unnamed Student";
  const hasSEN = !!student.sen?.trim();

  const handlePrint = () => {
    const printElement = document.getElementById('student-print');
    if (!printElement) return;

    const clone = printElement.cloneNode(true) as HTMLElement;

    const newWindow = window.open('', '', 'width=800,height=600');
    if (!newWindow) return;

    newWindow.document.write(`
      <html>
        <head>
          <title>Student Profile - ${fullName}</title>
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
            .info-card {
              border: 1px solid #e2e8f0;
              border-radius: 8px;
              padding: 20px;
              margin-bottom: 20px;
              page-break-inside: avoid;
              background: #f8fafc;
            }
            .highlight-card {
              border: 2px solid #eab308;
              background: #fef3c7;
            }
            .grid-2 {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
              margin-top: 15px;
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
            .meta-info span {
              display: inline-flex;
              align-items: center;
              gap: 6px;
              margin-right: 8px;
            }
            ul {
              padding-left: 20px;
              margin: 8px 0;
            }
            li {
              margin-bottom: 8px;
            }
            strong {
              color: #1e293b;
              font-weight: 600;
            }
            button {
              display: none !important;
            }
            .sen-badge {
              display: inline-block;
              background: #fef3c7;
              color: #92400e;
              padding: 4px 12px;
              border-radius: 12px;
              font-size: 0.85em;
              font-weight: 600;
              border: 1px solid #fbbf24;
            }
            @media print {
              .info-card {
                page-break-inside: avoid;
              }
              body {
                margin: 15px;
              }
              .grid-2 {
                grid-template-columns: 1fr;
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
    <div id="student-print" className="ExpandedStudentProfileView max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6 sm:space-y-8">
      {/* --- HEADER --- */}
      <header className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
                {fullName}
              </h2>
              {hasSEN && (
                <div className="mt-2">
                  <span className="sen-badge inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700">
                    <AlertTriangle size={14} />
                    Special Educational Needs
                  </span>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={handlePrint}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm w-full sm:w-auto"
          >
            <Printer size={18} />
            <span>Print / Export PDF</span>
          </button>
        </div>

        {/* Meta Information Card */}
        <div className="meta-info rounded-lg border border-border bg-card p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 sm:gap-x-4 sm:gap-y-2 text-sm">
            <span className="flex items-center gap-2 font-medium">
              <GraduationCap size={18} className="text-primary flex-shrink-0" />
              <span className="truncate">{student.level || "No level assigned"}</span>
            </span>
            <div className="flex flex-col sm:flex-row sm:ml-auto gap-2 sm:gap-4 w-full sm:w-auto">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Calendar size={16} className="flex-shrink-0" />
                <span className="truncate">Created: {new Date(student.created_at || "").toLocaleDateString()}</span>
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* --- SPECIAL EDUCATIONAL NEEDS (Highlighted if present) --- */}
      {hasSEN && (
        <section>
          <div className="rounded-lg border-2 border-yellow-500 bg-gradient-to-br from-yellow-50 to-yellow-100/50 dark:from-yellow-950/20 dark:to-yellow-900/10 p-4 sm:p-5 shadow-md">
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-yellow-600 dark:text-yellow-400 mt-1 flex-shrink-0" size={24} />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base sm:text-lg text-yellow-900 dark:text-yellow-100 mb-3">
                  Special Educational Needs (SEN)
                </h3>
                <div className="text-sm text-yellow-800 dark:text-yellow-200">
                  <FormattedContent content={student.sen || ""} />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* --- OVERVIEW SECTION --- */}
      {(student.goals || student.interests) && (
        <section>
          <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Target className="text-primary flex-shrink-0" size={24} />
            <span>Student Overview</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoCard
              icon={Target}
              title="Goals"
              content={student.goals || ""}
              iconColor="text-blue-600 dark:text-blue-400"
            />
            <InfoCard
              icon={Sparkles}
              title="Interests"
              content={student.interests || ""}
              iconColor="text-purple-600 dark:text-purple-400"
            />
          </div>
        </section>
      )}

      {/* --- LEARNING STYLE SECTION --- */}
      {student.learning_preferences && (
        <section>
          <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            <BrainCircuit className="text-primary flex-shrink-0" size={24} />
            <span>Learning Style</span>
          </h3>
          <InfoCard
            icon={BrainCircuit}
            title="Learning Preferences"
            content={student.learning_preferences}
            iconColor="text-indigo-600 dark:text-indigo-400"
          />
        </section>
      )}

      {/* --- ASSESSMENT SECTION --- */}
      {(student.strengths || student.weaknesses) && (
        <section>
          <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            <ChartLine className="text-primary flex-shrink-0" size={24} />
            <span>Assessment</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoCard
              icon={BicepsFlexed}
              title="Strengths"
              content={student.strengths || ""}
              iconColor="text-green-600 dark:text-green-400"
            />
            <InfoCard
              icon={ChartLine}
              title="Areas to Improve"
              content={student.weaknesses || ""}
              iconColor="text-amber-600 dark:text-amber-400"
            />
          </div>
        </section>
      )}

      {/* --- NOTES SECTION --- */}
      {student.notes && (
        <section>
          <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            <FileText className="text-primary flex-shrink-0" size={24} />
            <span>Additional Notes</span>
          </h3>
          <div className="rounded-lg border border-border bg-card p-4 sm:p-5 shadow-sm">
            <div className="text-sm text-muted-foreground">
              <FormattedContent content={student.notes} />
            </div>
          </div>
        </section>
      )}

      {/* --- FOOTER METADATA --- */}
      <footer className="pt-6 border-t border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar size={12} className="flex-shrink-0" />
              <span className="truncate">Created: {new Date(student.created_at || "").toLocaleString()}</span>
            </span>
            {student.updated_at && (
              <>
                <span className="hidden sm:inline">•</span>
                <span className="flex items-center gap-1">
                  <Clock size={12} className="flex-shrink-0" />
                  <span className="truncate">Updated: {new Date(student.updated_at).toLocaleString()}</span>
                </span>
              </>
            )}
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