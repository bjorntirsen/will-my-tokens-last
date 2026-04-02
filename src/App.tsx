import { useEffect, useState } from "react";
import { z } from "zod";

function App() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");

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

  type HolidayResponse = z.infer<typeof HolidaySchema>;

  const [data, setData] = useState<HolidayResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  function getDayOfWeek(dateString: string) {
    const day = new Date(dateString).getDay(); // 0 = Sun, 1 = Mon ...
    return day === 0 ? 7 : day; // convert to 1 = Mon ... 7 = Sun
  }

  function isWeekend(dateString: string) {
    const day = new Date(dateString).getDay();
    return day === 0 || day === 6;
  }

  const calendarDays =
    data?.dagar.map((d) => {
      const weekend = isWeekend(d.datum);

      return {
        ...d,
        dayOfWeek: getDayOfWeek(d.datum),
        isWeekend: weekend,
        isWorkingDay: !d.arbetsfriDag && !weekend,
      };
    }) ?? [];

  useEffect(() => {
    async function fetchHolidays() {
      try {
        const res = await fetch(`https://sholiday.faboul.se/dagar/v2.1/${year}/${month}`);
        const json = await res.json();
        console.log(json.dagar[0].röd_dag);
        const parsed = HolidaySchema.parse(json);
        setData(parsed);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch holidays");
      }
    }

    void fetchHolidays();
  }, [year, month, HolidaySchema]);

  const formatter = new Intl.DateTimeFormat("sv-SE", {
    month: "long",
    year: "numeric",
  });

  const formatted = formatter.format(now);

  const today = new Date().toISOString().slice(0, 10);

  const remainingWorkingDays = calendarDays.filter((day) => {
    return (
      day.datum >= today && // today + future
      !day.arbetsfriDag && // not holiday
      !day.isWeekend // not weekend
    );
  }).length;

  const totalWorkingDays = calendarDays.filter((day) => !day.arbetsfriDag && !day.isWeekend).length;

  const remainingPercentage = Math.min(
    100,
    Math.max(0, Math.round((remainingWorkingDays / totalWorkingDays) * 100)),
  );

  return (
    <main>
      <h1>Will my tokens last?</h1>
      <p>Det är {formatted}.</p>
      <p>Det är {remainingWorkingDays} arbetsdagar kvar på månaden inklusive idag.</p>
      <p>
        Om du vill sprida ut dina tokens jämnt över månaden bör du ha ungefär {remainingPercentage}%
        kvar.
      </p>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "4px",
          marginTop: "16px",
        }}
      >
        {/* Weekday headers */}
        {["Mån", "Tis", "Ons", "Tor", "Fre", "Lör", "Sön"].map((d) => (
          <div key={d} style={{ fontWeight: "bold", textAlign: "center" }}>
            {d}
          </div>
        ))}

        {/* Empty cells before first day */}
        {calendarDays.length > 0 &&
          Array.from({ length: calendarDays[0].dayOfWeek - 1 }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}

        {/* Days */}
        {calendarDays.map((day) => (
          <div
            key={day.datum}
            style={{
              padding: "8px",
              textAlign: "center",
              border:
                day.datum === today
                  ? "2px solid var(--calendar-today-border)"
                  : "1px solid var(--calendar-cell-border)",
              borderRadius: "4px",
              background: day.arbetsfriDag
                ? "var(--calendar-holiday-bg)"
                : day.isWeekend
                  ? "var(--calendar-weekend-bg)"
                  : "var(--calendar-working-bg)",
              color: "var(--calendar-text)",
            }}
          >
            {new Date(day.datum).getDate()}
          </div>
        ))}
      </div>
    </main>
  );
}

export default App;
