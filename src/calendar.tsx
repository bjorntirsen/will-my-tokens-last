type CalendarDay = {
  datum: string;
  arbetsfriDag: boolean;
  dayOfWeek: number;
  isWeekend: boolean;
  isWorkingDay: boolean;
};

type Props = {
  days: CalendarDay[];
  today?: string;
  weekdays: string[];
  customDaysOff?: Record<string, "off" | "half">;
  onDayClick?: (datum: string) => void;
};

export function Calendar({ days, today, weekdays, customDaysOff = {}, onDayClick }: Props) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)",
        gap: "4px",
        marginTop: "16px",
        marginBottom: "16px",
      }}
    >
      {weekdays.map((d) => (
        <div key={d} style={{ fontWeight: "bold", textAlign: "center" }}>
          {d}
        </div>
      ))}

      {days.length > 0 &&
        Array.from({ length: days[0].dayOfWeek - 1 }).map((_, i) => <div key={`empty-${i}`} />)}

      {days.map((day) => {
        const customStatus = day.isWorkingDay ? customDaysOff[day.datum] : undefined;
        const background = day.arbetsfriDag
          ? "var(--calendar-holiday-bg)"
          : day.isWeekend
            ? "var(--calendar-weekend-bg)"
            : customStatus === "off"
              ? "var(--calendar-custom-off-bg)"
              : customStatus === "half"
                ? "linear-gradient(135deg, var(--calendar-working-bg) 50%, var(--calendar-custom-off-bg) 50%)"
                : "var(--calendar-working-bg)";
        const clickable = day.isWorkingDay && onDayClick;
        return (
          <div
            key={day.datum}
            onClick={clickable ? () => onDayClick(day.datum) : undefined}
            style={{
              padding: "8px",
              textAlign: "center",
              border:
                day.datum === today
                  ? "2px solid var(--calendar-today-border)"
                  : "1px solid var(--calendar-cell-border)",
              borderRadius: "4px",
              background,
              color: "var(--calendar-text)",
              cursor: clickable ? "pointer" : "default",
            }}
          >
            {new Date(day.datum).getDate()}
          </div>
        );
      })}
    </div>
  );
}
