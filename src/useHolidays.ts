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

export type HolidaysData = {
  current: HolidayResponse;
  next: HolidayResponse;
};

export function useHolidays() {
  const [holidaysData, setHolidaysData] = useState<HolidaysData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const nextMonthDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const nextMonthYear = nextMonthDate.getFullYear();
  const nextMonth = String(nextMonthDate.getMonth() + 1).padStart(2, "0");

  useEffect(() => {
    async function fetchAll() {
      try {
        const [res, nextRes] = await Promise.all([
          fetch(`https://sholiday.faboul.se/dagar/v2.1/${year}/${month}`),
          fetch(`https://sholiday.faboul.se/dagar/v2.1/${nextMonthYear}/${nextMonth}`),
        ]);
        const [json, nextJson] = await Promise.all([res.json(), nextRes.json()]);
        setHolidaysData({
          current: HolidaySchema.parse(json),
          next: HolidaySchema.parse(nextJson),
        });
      } catch (err) {
        console.error(err);
        setError("Failed to fetch holidays");
        trackEvent("holidays-fetch-error", "Holidays API fetch failed");
      }
    }

    void fetchAll();
  }, [year, month, nextMonthYear, nextMonth]);

  return { holidaysData, error };
}
