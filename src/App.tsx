import { useState } from "react";
import { useLang } from "./useLang";
import { useTheme } from "./useTheme";
import { useHolidays } from "./useHolidays";
import { Calendar } from "./calendar";
import { translations } from "./translations";
import { calculateWorkingDays } from "./calculateWorkingDays";

function App() {
  const { lang, setLang } = useLang();
  const { theme, setTheme } = useTheme();
  const { data, nextData, error } = useHolidays();
  const [showNextMonth, setShowNextMonth] = useState(false);

  const t = translations[lang];

  const dagar = data?.dagar ?? [];

  const {
    calendarDays,
    today,
    remainingWorkingDays,
    remainingPercentage,
    endOfDayPercentage,
    includesToday,
  } = calculateWorkingDays(dagar);

  const now = new Date();

  const formatted = new Intl.DateTimeFormat(lang === "sv" ? "sv-SE" : "en-US", {
    month: "long",
    year: "numeric",
  }).format(now);

  const nextMonthDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const nextFormatted = new Intl.DateTimeFormat(lang === "sv" ? "sv-SE" : "en-US", {
    month: "long",
    year: "numeric",
  }).format(nextMonthDate);

  const {
    calendarDays: nextCalendarDays,
    today: nextToday,
    remainingWorkingDays: nextWorkingDays,
  } = calculateWorkingDays(nextData?.dagar ?? []);

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
      <p>{t.remainingDays(remainingWorkingDays, includesToday)}</p>
      <p>{t.percentage(remainingPercentage, endOfDayPercentage, includesToday)}</p>

      {error && <p style={{ color: "red" }}>{t.error}</p>}

      <Calendar days={calendarDays} today={today} weekdays={t.weekdays} />

      <button
        className={`next-month-toggle ${showNextMonth ? "active" : ""}`}
        onClick={() => setShowNextMonth(!showNextMonth)}
      >
        {showNextMonth ? t.hideNextMonth : t.viewNextMonth}
      </button>

      {showNextMonth && (
        <>
          <p>{t.nextMonthText(nextFormatted)}</p>
          <p>{t.nextMonthDays(nextWorkingDays)}</p>
          <Calendar days={nextCalendarDays} today={nextToday} weekdays={t.weekdays} />
        </>
      )}
    </main>
  );
}

export default App;
