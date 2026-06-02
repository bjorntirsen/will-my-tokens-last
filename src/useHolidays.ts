import { z } from "zod";
import { useState, useEffect } from "react";
import { trackEvent } from "./track";

const RawHolidaySchema = z.object({
  dagar: z.array(
    z.object({
      datum: z.string(),
      "arbetsfri dag": z.string(),
    }),
  ),
});

const HolidaySchema = RawHolidaySchema.transform((data) => ({
  dagar: data.dagar.map((d) => ({
    datum: d.datum,
    arbetsfriDag: d["arbetsfri dag"].trim() === "Ja",
  })),
}));

export type HolidayResponse = z.infer<typeof HolidaySchema>;

const CACHE_TTL_MS = 62 * 24 * 60 * 60 * 1000;

function getCached(key: string): HolidayResponse | null {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return null;
    const { raw, cachedAt } = JSON.parse(stored) as { raw: unknown; cachedAt: number };
    if (Date.now() - cachedAt > CACHE_TTL_MS) return null;
    return HolidaySchema.parse(raw);
  } catch {
    return null;
  }
}

function setCached(key: string, raw: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify({ raw, cachedAt: Date.now() }));
  } catch {
    // Ignore cache write failures.
  }
}

async function fetchOne(y: number, m: string): Promise<HolidayResponse> {
  const cacheKey = `holidays-${y}-${m}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;
  const res = await fetch(`https://sholiday.faboul.se/dagar/v2.1/${y}/${m}`);
  const raw = (await res.json()) as unknown;
  const parsed = HolidaySchema.parse(raw);
  setCached(cacheKey, raw);
  return parsed;
}

export function useHolidays() {
  const [current, setCurrent] = useState<HolidayResponse | null>(null);
  const [next, setNext] = useState<HolidayResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [nextError, setNextError] = useState(false);

  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const nextMonthDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const nextMonthYear = nextMonthDate.getFullYear();
  const nextMonth = String(nextMonthDate.getMonth() + 1).padStart(2, "0");

  useEffect(() => {
    fetchOne(year, month)
      .then(setCurrent)
      .catch(() => {
        setError("Failed to fetch holidays");
        trackEvent("holidays-fetch-error");
      });

    fetchOne(nextMonthYear, nextMonth)
      .then(setNext)
      .catch(() => {
        setNextError(true);
        trackEvent("holidays-fetch-error");
      });
  }, [year, month, nextMonthYear, nextMonth]);

  return { current, next, error, nextError };
}
