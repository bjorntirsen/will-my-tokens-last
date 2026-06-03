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
      <a
        href="https://github.com/bjorntirsen/will-my-tokens-last"
        target="_blank"
        className="github-link"
        title={t.viewSourceCode}
        aria-label={t.viewSourceCode}
      >
        <svg height="14" viewBox="0 0 16 16" width="14" aria-hidden="true" fill="currentColor">
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
        </svg>
      </a>

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
