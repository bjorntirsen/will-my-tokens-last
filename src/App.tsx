import { useState, useEffect } from "react";
import { useLang } from "./useLang";
import { useTheme } from "./useTheme";
import { usePercentageMode } from "./usePercentageMode";
import { useHolidays } from "./useHolidays";
import { useCustomDaysOff } from "./useCustomDaysOff";
import { Calendar } from "./calendar";
import { CalendarSkeleton } from "./skeleton";
import { translations } from "./translations";
import { calculateMonthStats } from "./calculateMonthStats";
import { trackEvent } from "./track";

function App() {
  const { lang, setLang } = useLang();
  const { theme, setTheme } = useTheme();
  const { mode: percentageMode, setMode: setPercentageMode } = usePercentageMode();
  const { current, next, error, nextError } = useHolidays();
  const [showNextMonth, setShowNextMonth] = useState(
    () => localStorage.getItem("showNextMonth") === "true",
  );

  useEffect(() => {
    localStorage.setItem("showNextMonth", String(showNextMonth));
  }, [showNextMonth]);

  const { daysOff, toggleDay, clearAll } = useCustomDaysOff();

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
  } = calculateMonthStats(current, next, lang, daysOff);

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
      <div className="segmented">
        {(["left", "used"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setPercentageMode(m)}
            className={percentageMode === m ? "active" : ""}
          >
            {t.percentageMode[m]}
          </button>
        ))}
      </div>

      <h1>{t.title}</h1>

      {current === null ? (
        <CalendarSkeleton weekdays={t.weekdays} showNextMonth={showNextMonth} />
      ) : (
        <>
          <p>{t.monthText(currentMonthLabel)}</p>
          <p>{t.remainingDays(remainingWorkingDays, includesToday)}</p>
          <p>
            {percentageMode === "used"
              ? t.percentageUsed(100 - remainingPercentage, 100 - endOfDayPercentage, includesToday)
              : t.percentage(remainingPercentage, endOfDayPercentage, includesToday)}
          </p>

          {error && <p style={{ color: "red" }}>{t.error}</p>}

          {Object.keys(daysOff).length === 0 ? (
            <p style={{ color: "var(--text)", fontSize: "14px", marginTop: "8px" }}>{t.tip}</p>
          ) : (
            <button className="next-month-toggle" onClick={clearAll}>
              {t.removeAllDaysOff}
            </button>
          )}

          <Calendar
            days={calendarDays}
            today={today}
            weekdays={t.weekdays}
            customDaysOff={daysOff}
            onDayClick={toggleDay}
          />

          <button
            className={`next-month-toggle ${showNextMonth ? "active" : ""}`}
            onClick={() => {
              if (!showNextMonth) trackEvent("view-next-month");
              setShowNextMonth(!showNextMonth);
            }}
          >
            {showNextMonth ? t.hideNextMonth : t.viewNextMonth}
          </button>

          {showNextMonth &&
            (next === null ? (
              nextError ? (
                <p style={{ color: "red" }}>{t.error}</p>
              ) : (
                <CalendarSkeleton weekdays={t.weekdays} nextMonthOnly />
              )
            ) : (
              <>
                <p>{t.nextMonthText(nextMonthWorkingDays, nextMonthLabel)}</p>
                <Calendar
                  days={nextMonthCalendarDays}
                  weekdays={t.weekdays}
                  customDaysOff={daysOff}
                  onDayClick={toggleDay}
                />
              </>
            ))}
        </>
      )}
    </main>
  );
}

export default App;
