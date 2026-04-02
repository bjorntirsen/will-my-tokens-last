import { useLang } from "./useLang";
import { useTheme } from "./useTheme";
import { useHolidays } from "./useHolidays";
import { Calendar } from "./calendar";

const translations = {
  sv: {
    title: "Kommer mina tokens räcka?",
    monthText: (formatted: string) => `Det är ${formatted}.`,
    remainingDays: (n: number) => `Det är ${n} arbetsdagar kvar på månaden inklusive idag.`,
    percentage: (p: number) =>
      `Om du vill sprida ut dina tokens jämnt över månaden bör du ha ungefär ${p}% kvar.`,
    error: "Misslyckades att hämta helgdagar",
    weekdays: ["Mån", "Tis", "Ons", "Tor", "Fre", "Lör", "Sön"],
    theme: {
      light: "☀️ Ljust",
      dark: "🌙 Mörkt",
      system: "🖥️ System",
    },
  },
  en: {
    title: "Will my tokens last?",
    monthText: (formatted: string) => `It is ${formatted}.`,
    remainingDays: (n: number) => `There are ${n} working days left this month including today.`,
    percentage: (p: number) =>
      `If you want to spread your tokens evenly, you should have about ${p}% left.`,
    error: "Failed to fetch holidays",
    weekdays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    theme: {
      light: "☀️ Light",
      dark: "🌙 Dark",
      system: "🖥️ System",
    },
  },
};

function getDayOfWeek(dateString: string) {
  const day = new Date(dateString).getDay();
  return day === 0 ? 7 : day;
}

function isWeekend(dateString: string) {
  const day = new Date(dateString).getDay();
  return day === 0 || day === 6;
}

function App() {
  const { lang, setLang } = useLang();
  const { theme, setTheme } = useTheme();

  const t = translations[lang];

  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");

  const { data, error } = useHolidays(year, month);

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
      <div className="segmented">
        {(["sv", "en"] as const).map((l) => (
          <button key={l} onClick={() => setLang(l)} className={lang === l ? "active" : ""}>
            {l === "sv" ? "Svenska" : "English"}
          </button>
        ))}
      </div>
      <div className="segmented">
        {(["light", "dark", "system"] as const).map((tMode) => (
          <button
            key={tMode}
            onClick={() => setTheme(tMode)}
            className={theme === tMode ? "active" : ""}
          >
            {t.theme[tMode]}
          </button>
        ))}
      </div>
      <h1>{t.title}</h1>
      <p>{t.monthText(formatted)}</p>
      <p>{t.remainingDays(remainingWorkingDays)}</p>
      <p>{t.percentage(remainingPercentage)}</p>

      {error && <p style={{ color: "red" }}>{t.error}</p>}

      <Calendar days={calendarDays} today={today} weekdays={t.weekdays} />
    </main>
  );
}

export default App;
