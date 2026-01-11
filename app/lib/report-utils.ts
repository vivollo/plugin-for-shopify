export const safeNumber = (n: unknown, fallback = 0) => {
  return typeof n === "number" && Number.isFinite(n) ? n : fallback;
};

export const pctChange = (current: number, previous: number) => {
  if (previous <= 0) return null;
  return ((current - previous) / previous) * 100;
};

export const formatPct = (p: number) => {
  const sign = p > 0 ? "+" : "";
  return `${sign}${p.toFixed(1)}%`;
};

export const formatInt = (n: number) => {
  return new Intl.NumberFormat().format(Math.round(n));
};

export const formatDateFromUnixSeconds = (ts: number) => {
  // ts is seconds (your sample looks like unix seconds)
  return new Date(ts * 1000).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
};

export const hourKeyToLabel = (key: string) => {
  // "hour::13" -> "13:00"
  const parts = key.split("::");
  const h = Number(parts[1] ?? 0);
  return `${String(h).padStart(2, "0")}:00`;
};

export const getTrend = (delta: number | null) => {
  if (delta === null) return null;
  const text = formatPct(delta);
  const tone = (delta > 0 ? "success" : delta < 0 ? "critical" : "neutral") as
    | "success"
    | "critical"
    | "neutral";
  const icon = (delta > 0 ? "arrow-up" : delta < 0 ? "arrow-down" : undefined) as
    | "arrow-up"
    | "arrow-down"
    | undefined;

  return { text, tone, icon };
};
