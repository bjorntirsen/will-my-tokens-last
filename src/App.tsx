import { useState } from "react";
import { useLang } from "./useLang";
import { useTheme } from "./useTheme";
import { useHolidays } from "./useHolidays";
import { Calendar } from "./calendar";
import { translations } from "./translations";
import { calculateMonthStats } from "./calculateMonthStats";

function App() {
  const { lang, setLang } = useLang();
  const { theme, setTheme } = useTheme();
  const { holidaysData, error } = useHolidays();
  const [showNextMonth, setShowNextMonth] = useState(false);

  const t = translations[lang];

  const {
    calendarDays,
    today,
    currentMonthLabel,
    nextMonthLabel,
    remainingWorkingDays,
    remainingPercentage,
    endOfDayPercentage,
    includesToday,
    nextMonthCalendarDays,
    nextMonthWorkingDays,
  } = calculateMonthStats(holidaysData, lang);

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
      <p>{t.monthText(currentMonthLabel)}</p>
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
          <p>{t.nextMonthText(nextMonthWorkingDays, nextMonthLabel)}</p>
          <Calendar days={nextMonthCalendarDays} weekdays={t.weekdays} />
        </>
      )}
    </main>
  );
}

export default App;
