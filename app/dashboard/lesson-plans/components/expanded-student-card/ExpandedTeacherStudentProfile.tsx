"use client";

import { useRouter } from "next/navigation";
import { StudentProfileTeacher } from "../../types/student_profile_teacher";
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
  Plus,
  PencilLine,
  BookOpen,
} from "lucide-react";

// Component to format content with bullets and bold text
function FormattedContent({ content }: { content: string }) {
  if (!content) return null;

  const parts = content.split(/•\s+/).filter(item => item.trim());

  if (parts.length <= 1) {
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

// Empty state prompt component
function EmptyStatePrompt({
  icon: Icon,
  title,
  description,
  buttonText,
  onAddClick,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  buttonText: string;
  onAddClick: () => void;
}) {
  return (
    <div className="rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/30 p-6 sm:p-8 text-center">
      <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
        <Icon className="h-6 w-6 text-muted-foreground" />
      </div>
      <h4 className="font-semibold text-foreground mb-2">{title}</h4>
      <p className="text-sm text-muted-foreground mb-4 max-w-sm mx-auto">
        {description}
      </p>
      <button
        onClick={onAddClick}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all hover:scale-105 shadow-sm"
      >
        <Plus size={16} />
        {buttonText}
      </button>
    </div>
  );
}

// Section empty state for inline prompts
function SectionEmptyState({
  message,
  onAddClick,
}: {
  message: string;
  onAddClick: () => void;
}) {
  return (
    <div className="rounded-lg border border-dashed border-muted-foreground/30 bg-muted/20 p-4 flex items-center justify-between gap-4">
      <p className="text-sm text-muted-foreground">{message}</p>
      <button
        onClick={onAddClick}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors flex-shrink-0"
      >
        <Plus size={14} />
        Add
      </button>
    </div>
  );
}

// Info card component for consistent styling
function InfoCard({
  icon: Icon,
  title,
  content,
  iconColor = "text-primary",
  highlight = false,
  onAddClick,
  emptyMessage,
}: {
  icon: React.ElementType;
  title: string;
  content: string;
  iconColor?: string;
  highlight?: boolean;
  onAddClick?: () => void;
  emptyMessage?: string;
}) {
  const isEmpty = !content || content.trim() === "";

  if (isEmpty && onAddClick && emptyMessage) {
    return (
      <div className="rounded-lg border border-dashed border-muted-foreground/30 bg-muted/10 p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <div className={`${iconColor} mt-1 flex-shrink-0 opacity-50`}>
            <Icon size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold mb-2 text-sm sm:text-base text-muted-foreground">
              {title}
            </h4>
            <p className="text-sm text-muted-foreground/70 mb-3">{emptyMessage}</p>
            <button
              onClick={onAddClick}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              <Plus size={14} />
              Add {title}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isEmpty) return null;

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

// Profile completeness indicator
function ProfileCompleteness({ student }: { student: StudentProfileTeacher }) {
  const fields = [
    { name: 'SEN', filled: !!student.special_educational_needs?.trim() },
    { name: 'Goals', filled: !!student.goals?.trim() },
    { name: 'Interests', filled: !!student.interests?.trim() },
    { name: 'Learning Preferences', filled: !!student.learning_preferences?.trim() },
    { name: 'Strengths', filled: !!student.strengths?.trim() },
    { name: 'Areas to Improve', filled: !!student.weaknesses?.trim() },
    { name: 'Notes', filled: !!student.notes?.trim() },
  ];

  const filledCount = fields.filter(f => f.filled).length;
  const percentage = Math.round((filledCount / fields.length) * 100);

  if (percentage === 100) return null;

  return (
    <div className="rounded-lg border border-border bg-gradient-to-r from-primary/5 to-primary/10 p-4 sm:p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
          <PencilLine className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h4 className="font-semibold text-foreground">Profile Completeness</h4>
          <p className="text-sm text-muted-foreground">{filledCount} of {fields.length} sections filled</p>
        </div>
        <div className="ml-auto text-2xl font-bold text-primary">{percentage}%</div>
      </div>
      
      {/* Progress bar */}
      <div className="h-2 bg-muted rounded-full overflow-hidden mb-3">
        <div 
          className="h-full bg-primary rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Missing fields */}
      <div className="flex flex-wrap gap-2">
        {fields.filter(f => !f.filled).map((field, idx) => (
          <span 
            key={idx}
            className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-md bg-muted text-muted-foreground"
          >
            <Plus size={12} />
            {field.name}
          </span>
        ))}
      </div>
    </div>
  );
}

export function ExpandedTeacherStudentProfileView({ 
  student,
  onEditProfile,
}: { 
  student: StudentProfileTeacher;
  onEditProfile?: () => void;
}) {
  const fullName = `${student.first_name ?? ""} ${student.last_name ?? ""}`.trim() || "Unnamed Student";
  const hasSEN = !!student.special_educational_needs?.trim();

  // Check if profile is mostly empty
  const hasOverviewData = student.goals?.trim() || student.interests?.trim();
  const hasLearningData = student.learning_preferences?.trim();
  const hasAssessmentData = student.strengths?.trim() || student.weaknesses?.trim();
  const hasNotesData = student.notes?.trim();
  const hasAnyData = hasOverviewData || hasLearningData || hasAssessmentData || hasNotesData || hasSEN;

  const router = useRouter()

  const handleAddInfo = () => {
    router.push(`/dashboard/student-profiles/teacher/${student.student_id}`)
  };

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
            button, .empty-state, .completeness {
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
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            {onEditProfile && (
              <button
                onClick={handleAddInfo}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-primary text-primary hover:bg-primary/10 transition-colors w-full sm:w-auto"
              >
                <PencilLine size={18} />
                <span>Edit Profile</span>
              </button>
            )}
            <button
              onClick={handlePrint}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm w-full sm:w-auto"
            >
              <Printer size={18} />
              <span>Print / Export PDF</span>
            </button>
          </div>
        </div>

        {/* Meta Information Card */}
        <div className="meta-info rounded-lg border border-border bg-card p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 sm:gap-x-4 sm:gap-y-2 text-sm">
            <span className="flex items-center gap-2 font-medium">
              <GraduationCap size={18} className="text-primary flex-shrink-0" />
              <span className="truncate">{student.class_name || "No classes assigned"}</span>
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

      {/* --- PROFILE COMPLETENESS --- */}
      <div className="completeness">
        <ProfileCompleteness student={student} />
      </div>

      {/* --- EMPTY STATE (when no data at all) --- */}
      {!hasAnyData && (
        <div className="empty-state">
          <EmptyStatePrompt
            icon={BookOpen}
            title="No student information yet"
            description="Start building this student's profile by adding their goals, interests, learning preferences, and more. A complete profile helps personalize their learning experience."
            buttonText="Add Student Information"
            onAddClick={handleAddInfo}
          />
        </div>
      )}

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
                  <FormattedContent content={student.special_educational_needs || ""} />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* --- OVERVIEW SECTION --- */}
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
            onAddClick={onEditProfile ? handleAddInfo : undefined}
            emptyMessage="What does this student want to achieve? Add their learning goals."
          />
          <InfoCard
            icon={Sparkles}
            title="Interests"
            content={student.interests || ""}
            iconColor="text-purple-600 dark:text-purple-400"
            onAddClick={onEditProfile ? handleAddInfo : undefined}
            emptyMessage="What topics excite this student? Add their interests."
          />
        </div>
      </section>

      {/* --- LEARNING STYLE SECTION --- */}
      <section>
        <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
          <BrainCircuit className="text-primary flex-shrink-0" size={24} />
          <span>Learning Style</span>
        </h3>
        <InfoCard
          icon={BrainCircuit}
          title="Learning Preferences"
          content={student.learning_preferences || ""}
          iconColor="text-indigo-600 dark:text-indigo-400"
          onAddClick={onEditProfile ? handleAddInfo : undefined}
          emptyMessage="How does this student learn best? Add their learning preferences."
        />
      </section>

      {/* --- ASSESSMENT SECTION --- */}
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
            onAddClick={onEditProfile ? handleAddInfo : undefined}
            emptyMessage="What is this student good at? Add their strengths."
          />
          <InfoCard
            icon={ChartLine}
            title="Areas to Improve"
            content={student.weaknesses || ""}
            iconColor="text-amber-600 dark:text-amber-400"
            onAddClick={onEditProfile ? handleAddInfo : undefined}
            emptyMessage="Where can this student grow? Add areas for improvement."
          />
        </div>
      </section>

           {/* --- NOTES SECTION --- */}
      <section>
        <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
          <FileText className="text-primary flex-shrink-0" size={24} />
          <span>Additional Notes</span>
        </h3>
        {student.notes?.trim() ? (
          <div className="rounded-lg border border-border bg-card p-4 sm:p-5 shadow-sm hover:shadow-md transition-all">
            <div className="text-sm text-muted-foreground">
              <FormattedContent content={student.notes} />
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-muted-foreground/30 bg-muted/10 p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <div className="text-muted-foreground/50 mt-1 flex-shrink-0">
                <FileText size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold mb-2 text-sm sm:text-base text-muted-foreground">
                  Additional Notes
                </h4>
                <p className="text-sm text-muted-foreground/70 mb-3">
                  Any other important information about this student? Add notes here.
                </p>
                {onEditProfile && (
                  <button
                    onClick={handleAddInfo}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                  >
                    <Plus size={14} />
                    Add Notes
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* --- QUICK ACTIONS (when profile is incomplete) --- */}
      {onEditProfile && !hasAnyData && (
        <section className="empty-state">
          <div className="rounded-lg border border-border bg-gradient-to-br from-muted/50 to-muted/30 p-6 sm:p-8">
            <h3 className="text-lg font-semibold text-foreground mb-4 text-center">
              Quick Start Guide
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <QuickActionCard
                icon={Target}
                title="Set Goals"
                description="Define what success looks like"
                onClick={handleAddInfo}
              />
              <QuickActionCard
                icon={Sparkles}
                title="Add Interests"
                description="Discover what motivates them"
                onClick={handleAddInfo}
              />
              <QuickActionCard
                icon={BrainCircuit}
                title="Learning Style"
                description="Understand how they learn best"
                onClick={handleAddInfo}
              />
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

          <div className="flex flex-col sm:flex-row gap-2 sm:hidden">
            {onEditProfile && (
              <button
                onClick={handleAddInfo}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-primary text-primary hover:bg-primary/10 transition-colors"
              >
                <PencilLine size={18} />
                <span>Edit Profile</span>
              </button>
            )}
            <button
              onClick={handlePrint}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
            >
              <Printer size={18} />
              <span>Print / Export PDF</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Quick action card for empty state
function QuickActionCard({
  icon: Icon,
  title,
  description,
  onClick,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group flex flex-col items-center p-4 rounded-lg border border-border bg-card hover:border-primary hover:shadow-md transition-all text-center"
    >
      <div className="h-12 w-12 rounded-full bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center mb-3 transition-colors">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <h4 className="font-semibold text-foreground mb-1">{title}</h4>
      <p className="text-xs text-muted-foreground">{description}</p>
    </button>
  );
}