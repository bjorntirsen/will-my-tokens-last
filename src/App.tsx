import { useEffect, useState } from "react";
import { z } from "zod";

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

type Lang = "sv" | "en";

const translations = {
  sv: {
    title: "Kommer mina tokens räcka?",
    monthText: (formatted: string) => `Det är ${formatted}.`,
    remainingDays: (n: number) => `Det är ${n} arbetsdagar kvar på månaden inklusive idag.`,
    percentage: (p: number) =>
      `Om du vill sprida ut dina tokens jämnt över månaden bör du ha ungefär ${p}% kvar.`,
    error: "Misslyckades att hämta helgdagar",
    weekdays: ["Mån", "Tis", "Ons", "Tor", "Fre", "Lör", "Sön"],
  },
  en: {
    title: "Will my tokens last?",
    monthText: (formatted: string) => `It is ${formatted}.`,
    remainingDays: (n: number) => `There are ${n} working days left this month including today.`,
    percentage: (p: number) =>
      `If you want to spread your tokens evenly, you should have about ${p}% remaining.`,
    error: "Failed to fetch holidays",
    weekdays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },
};

function App() {
  const [data, setData] = useState<HolidayResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lang, setLang] = useState<Lang>(() => {
    const saved = localStorage.getItem("lang") as Lang | null;
    if (saved) return saved;

    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith("sv")) return "sv";

    return "en";
  });
  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  const t = translations[lang];

  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");

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
  }, [year, month]);

  const formatter = new Intl.DateTimeFormat(lang === "sv" ? "sv-SE" : "en-US", {
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
      <div style={{ display: "inline-flex", border: "1px solid #ccc", borderRadius: 6 }}>
        {(["sv", "en"] as const).map((l) => (
          <button
            key={l}
            onClick={() => setLang(l)}
            style={{
              padding: "4px 8px",
              background: lang === l ? "#ddd" : "transparent",
              border: "none",
              cursor: "pointer",
            }}
          >
            {l === "sv" ? "Svenska" : "English"}
          </button>
        ))}
      </div>
      <h1>{t.title}</h1>
      <p>{t.monthText(formatted)}</p>
      <p>{t.remainingDays(remainingWorkingDays)}</p>
      <p>{t.percentage(remainingPercentage)}</p>

      {error && <p style={{ color: "red" }}>{t.error}</p>}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "4px",
          marginTop: "16px",
        }}
      >
        {/* Weekday headers */}
        {t.weekdays.map((d) => (
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
