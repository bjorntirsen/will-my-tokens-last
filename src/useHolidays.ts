import { z } from "zod";
import { useState, useEffect } from "react";

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

export function useHolidays() {
  const [data, setData] = useState<HolidayResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");

  useEffect(() => {
    async function fetchHolidays() {
      try {
        const res = await fetch(`https://sholiday.faboul.se/dagar/v2.1/${year}/${month}`);
        const json = await res.json();
        const parsed = HolidaySchema.parse(json);
        setData(parsed);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch holidays");
      }
    }

    void fetchHolidays();
  }, [year, month]);

  return { data, error };
}
