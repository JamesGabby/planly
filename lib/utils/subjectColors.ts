// utils/subjectColors.ts

export type SubjectKey =
  | "mathematics"
  | "english"
  | "science"
  | "history"
  | "geography"
  | "art"
  | "music"
  | "physical_education"
  | "computing"
  | "computer_science" // Added as separate subject
  | "languages"
  | "religious_education"
  | "design_technology"
  | "drama"
  | "business"
  | "psychology"
  | "economics"
  | "biology"
  | "chemistry"
  | "physics"
  | "default";

interface SubjectColorConfig {
  bg: string;
  text: string;
  border: string;
  dot: string;
  bgHover: string;
}

// Consistent color palette for subjects across the app
export const SUBJECT_COLORS: Record<SubjectKey, SubjectColorConfig> = {
  mathematics: {
    bg: "bg-blue-50 dark:bg-blue-950/30",
    text: "text-blue-700 dark:text-blue-300",
    border: "border-blue-200 dark:border-blue-800",
    dot: "bg-blue-500",
    bgHover: "hover:bg-blue-100 dark:hover:bg-blue-950/50",
  },
  english: {
    bg: "bg-amber-50 dark:bg-amber-950/30",
    text: "text-amber-700 dark:text-amber-300",
    border: "border-amber-200 dark:border-amber-800",
    dot: "bg-amber-500",
    bgHover: "hover:bg-amber-100 dark:hover:bg-amber-950/50",
  },
  science: {
    bg: "bg-green-50 dark:bg-green-950/30",
    text: "text-green-700 dark:text-green-300",
    border: "border-green-200 dark:border-green-800",
    dot: "bg-green-500",
    bgHover: "hover:bg-green-100 dark:hover:bg-green-950/50",
  },
  history: {
    bg: "bg-orange-50 dark:bg-orange-950/30",
    text: "text-orange-700 dark:text-orange-300",
    border: "border-orange-200 dark:border-orange-800",
    dot: "bg-orange-500",
    bgHover: "hover:bg-orange-100 dark:hover:bg-orange-950/50",
  },
  geography: {
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    text: "text-emerald-700 dark:text-emerald-300",
    border: "border-emerald-200 dark:border-emerald-800",
    dot: "bg-emerald-500",
    bgHover: "hover:bg-emerald-100 dark:hover:bg-emerald-950/50",
  },
  art: {
    bg: "bg-pink-50 dark:bg-pink-950/30",
    text: "text-pink-700 dark:text-pink-300",
    border: "border-pink-200 dark:border-pink-800",
    dot: "bg-pink-500",
    bgHover: "hover:bg-pink-100 dark:hover:bg-pink-950/50",
  },
  music: {
    bg: "bg-purple-50 dark:bg-purple-950/30",
    text: "text-purple-700 dark:text-purple-300",
    border: "border-purple-200 dark:border-purple-800",
    dot: "bg-purple-500",
    bgHover: "hover:bg-purple-100 dark:hover:bg-purple-950/50",
  },
  physical_education: {
    bg: "bg-red-50 dark:bg-red-950/30",
    text: "text-red-700 dark:text-red-300",
    border: "border-red-200 dark:border-red-800",
    dot: "bg-red-500",
    bgHover: "hover:bg-red-100 dark:hover:bg-red-950/50",
  },
  // Computing - Cyan (lighter, more general IT feel)
  computing: {
    bg: "bg-cyan-50 dark:bg-cyan-950/30",
    text: "text-cyan-700 dark:text-cyan-300",
    border: "border-cyan-200 dark:border-cyan-800",
    dot: "bg-cyan-500",
    bgHover: "hover:bg-cyan-100 dark:hover:bg-cyan-950/50",
  },
  // Computer Science - Zinc (darker, more technical/academic feel)
  computer_science: {
    bg: "bg-zinc-100 dark:bg-zinc-900/50",
    text: "text-zinc-700 dark:text-zinc-300",
    border: "border-zinc-300 dark:border-zinc-700",
    dot: "bg-zinc-600",
    bgHover: "hover:bg-zinc-200 dark:hover:bg-zinc-800/50",
  },
  languages: {
    bg: "bg-indigo-50 dark:bg-indigo-950/30",
    text: "text-indigo-700 dark:text-indigo-300",
    border: "border-indigo-200 dark:border-indigo-800",
    dot: "bg-indigo-500",
    bgHover: "hover:bg-indigo-100 dark:hover:bg-indigo-950/50",
  },
  religious_education: {
    bg: "bg-violet-50 dark:bg-violet-950/30",
    text: "text-violet-700 dark:text-violet-300",
    border: "border-violet-200 dark:border-violet-800",
    dot: "bg-violet-500",
    bgHover: "hover:bg-violet-100 dark:hover:bg-violet-950/50",
  },
  design_technology: {
    bg: "bg-stone-50 dark:bg-stone-950/30",
    text: "text-stone-700 dark:text-stone-300",
    border: "border-stone-200 dark:border-stone-800",
    dot: "bg-stone-500",
    bgHover: "hover:bg-stone-100 dark:hover:bg-stone-950/50",
  },
  drama: {
    bg: "bg-fuchsia-50 dark:bg-fuchsia-950/30",
    text: "text-fuchsia-700 dark:text-fuchsia-300",
    border: "border-fuchsia-200 dark:border-fuchsia-800",
    dot: "bg-fuchsia-500",
    bgHover: "hover:bg-fuchsia-100 dark:hover:bg-fuchsia-950/50",
  },
  business: {
    bg: "bg-teal-50 dark:bg-teal-950/30",
    text: "text-teal-700 dark:text-teal-300",
    border: "border-teal-200 dark:border-teal-800",
    dot: "bg-teal-500",
    bgHover: "hover:bg-teal-100 dark:hover:bg-teal-950/50",
  },
  psychology: {
    bg: "bg-rose-50 dark:bg-rose-950/30",
    text: "text-rose-700 dark:text-rose-300",
    border: "border-rose-200 dark:border-rose-800",
    dot: "bg-rose-500",
    bgHover: "hover:bg-rose-100 dark:hover:bg-rose-950/50",
  },
  economics: {
    bg: "bg-lime-50 dark:bg-lime-950/30",
    text: "text-lime-700 dark:text-lime-300",
    border: "border-lime-200 dark:border-lime-800",
    dot: "bg-lime-500",
    bgHover: "hover:bg-lime-100 dark:hover:bg-lime-950/50",
  },
  biology: {
    bg: "bg-green-50 dark:bg-green-950/30",
    text: "text-green-700 dark:text-green-300",
    border: "border-green-200 dark:border-green-800",
    dot: "bg-green-500",
    bgHover: "hover:bg-green-100 dark:hover:bg-green-950/50",
  },
  chemistry: {
    bg: "bg-yellow-50 dark:bg-yellow-950/30",
    text: "text-yellow-700 dark:text-yellow-300",
    border: "border-yellow-200 dark:border-yellow-800",
    dot: "bg-yellow-500",
    bgHover: "hover:bg-yellow-100 dark:hover:bg-yellow-950/50",
  },
  physics: {
    bg: "bg-sky-50 dark:bg-sky-950/30",
    text: "text-sky-700 dark:text-sky-300",
    border: "border-sky-200 dark:border-sky-800",
    dot: "bg-sky-500",
    bgHover: "hover:bg-sky-100 dark:hover:bg-sky-950/50",
  },
  default: {
    bg: "bg-gray-50 dark:bg-gray-950/30",
    text: "text-gray-700 dark:text-gray-300",
    border: "border-gray-200 dark:border-gray-800",
    dot: "bg-gray-500",
    bgHover: "hover:bg-gray-100 dark:hover:bg-gray-950/50",
  },
};

// Helper function to normalize subject string to key
export function normalizeSubjectKey(subject: string): SubjectKey {
  if (!subject || typeof subject !== "string") {
    return "default";
  }

  const normalized = subject
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^a-z_]/g, "");

  const subjectMap: Record<string, SubjectKey> = {
    // Mathematics
    math: "mathematics",
    maths: "mathematics",
    mathematics: "mathematics",
    numeracy: "mathematics",

    // English
    english: "english",
    language_arts: "english",
    literacy: "english",
    english_language: "english",
    english_literature: "english",

    // General Science
    science: "science",
    general_science: "science",

    // Biology
    biology: "biology",
    bio: "biology",

    // Chemistry
    chemistry: "chemistry",
    chem: "chemistry",

    // Physics
    physics: "physics",
    phys: "physics",

    // History
    history: "history",

    // Geography
    geography: "geography",
    geo: "geography",

    // Art
    art: "art",
    arts: "art",
    visual_arts: "art",
    fine_art: "art",

    // Music
    music: "music",

    // Physical Education
    pe: "physical_education",
    physical_education: "physical_education",
    sport: "physical_education",
    sports: "physical_education",
    games: "physical_education",

    // Computer Science - SEPARATE SUBJECT
    computer_science: "computer_science",
    computerscience: "computer_science",
    comp_sci: "computer_science",
    compsci: "computer_science",
    cs: "computer_science",

    // Computing - SEPARATE SUBJECT
    computing: "computing",
    ict: "computing",
    it: "computing",
    information_technology: "computing",
    digital_technology: "computing",

    // Languages
    languages: "languages",
    french: "languages",
    spanish: "languages",
    german: "languages",
    mandarin: "languages",
    chinese: "languages",
    italian: "languages",
    japanese: "languages",
    latin: "languages",
    mfl: "languages",
    modern_languages: "languages",
    modern_foreign_languages: "languages",
    foreign_languages: "languages",

    // Religious Education
    re: "religious_education",
    religious_education: "religious_education",
    religion: "religious_education",
    religious_studies: "religious_education",
    rs: "religious_education",

    // Design & Technology
    dt: "design_technology",
    design_technology: "design_technology",
    design_and_technology: "design_technology",
    food_technology: "design_technology",
    textiles: "design_technology",
    resistant_materials: "design_technology",

    // Drama
    drama: "drama",
    theatre: "drama",
    theater: "drama",
    performing_arts: "drama",

    // Business
    business: "business",
    business_studies: "business",

    // Psychology
    psychology: "psychology",
    psych: "psychology",

    // Economics
    economics: "economics",
    econ: "economics",
  };

  return subjectMap[normalized] || "default";
}

// Get subject colors by subject string
export function getSubjectColors(subject: string): SubjectColorConfig {
  const key = normalizeSubjectKey(subject);
  return SUBJECT_COLORS[key];
}

// Get display name for subject
export function getSubjectDisplayName(subject: string): string {
  const displayNames: Record<SubjectKey, string> = {
    mathematics: "Mathematics",
    english: "English",
    science: "Science",
    history: "History",
    geography: "Geography",
    art: "Art",
    music: "Music",
    physical_education: "PE",
    computing: "Computing",
    computer_science: "Computer Science", // Separate display name
    languages: "Languages",
    religious_education: "RE",
    design_technology: "D&T",
    drama: "Drama",
    business: "Business",
    psychology: "Psychology",
    economics: "Economics",
    biology: "Biology",
    chemistry: "Chemistry",
    physics: "Physics",
    default: subject || "General",
  };

  const key = normalizeSubjectKey(subject);

  // If it's default, return the original subject name
  if (key === "default" && subject) {
    return subject;
  }

  return displayNames[key];
}