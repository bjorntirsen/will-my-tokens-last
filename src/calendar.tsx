type CalendarDay = {
  datum: string;
  arbetsfriDag: boolean;
  dayOfWeek: number;
  isWeekend: boolean;
  isWorkingDay: boolean;
};

type Props = {
  days: CalendarDay[];
  today: string;
  weekdays: string[];
};

export function Calendar({ days, today, weekdays }: Props) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)",
        gap: "4px",
        marginTop: "16px",
      }}
    >
      {weekdays.map((d) => (
        <div key={d} style={{ fontWeight: "bold", textAlign: "center" }}>
          {d}
        </div>
      ))}

      {days.length > 0 &&
        Array.from({ length: days[0].dayOfWeek - 1 }).map((_, i) => <div key={`empty-${i}`} />)}

      {days.map((day) => (
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
  );
}
