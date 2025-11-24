import { Resource } from "../types/lesson_teacher";

/* --- HELPERS --- */
export function prettyDate(d?: string | null) {
  if (!d) return "—";
  try {
    const dt = new Date(d);
    return dt.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return d;
  }
}

export function prettyTime(t?: string | null) {
  if (!t) return "—";
  try {
    const dt = new Date(`1970-01-01T${t}`);
    let formatted = dt.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    formatted = formatted.replace(/^0/, ""); // remove leading zero
    formatted = formatted.replace(/\bAM\b/, "am").replace(/\bPM\b/, "pm"); // lowercase am/pm
    return formatted;
  } catch {
    return t;
  }
}

// In your utils/helpers file
export function parseResources(resources: Resource[] | null | undefined): Resource[] {
  if (!resources || !Array.isArray(resources)) return [];
  return resources;
}

// Add to your utils/helpers file
export function parseStructuredText(text: string): {
  bullets: string[];
  paragraphs: string[];
} {
  if (!text) return { bullets: [], paragraphs: [] };
  
  // Split by bullet points
  const bullets = text
    .split(/•\s+/)
    .filter(item => item.trim())
    .map(item => item.replace(/\*\*/g, '').trim());
  
  return { bullets, paragraphs: [] };
}