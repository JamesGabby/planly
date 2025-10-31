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

export function parseResources(res: Object): { title: string; url: string }[] {
  if (!res) return [];
  try {
    if (Array.isArray(res)) return res;
    if (typeof res === "string") return JSON.parse(res);
  } catch {}
  return [];
}