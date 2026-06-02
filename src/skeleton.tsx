type Props = {
  weekdays: string[];
  showNextMonth?: boolean;
  nextMonthOnly?: boolean;
};

function MonthGrid({ weekdays }: { weekdays: string[] }) {
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

      {Array.from({ length: 35 }).map((_, i) => (
        <div key={i} className="skeleton-block" style={{ height: "42px" }} />
      ))}
    </div>
  );
}

function NextMonthSkeleton({ weekdays }: { weekdays: string[] }) {
  return (
    <>
      <div
        className="skeleton-block"
        style={{ height: "1em", width: "55%", margin: "0 auto 8px" }}
      />
      <MonthGrid weekdays={weekdays} />
    </>
  );
}

export function CalendarSkeleton({
  weekdays,
  showNextMonth = false,
  nextMonthOnly = false,
}: Props) {
  if (nextMonthOnly) {
    return <NextMonthSkeleton weekdays={weekdays} />;
  }

  return (
    <>
      <div
        className="skeleton-block"
        style={{ height: "1em", width: "40%", margin: "0 auto 8px" }}
      />
      <div
        className="skeleton-block"
        style={{ height: "1em", width: "72%", margin: "0 auto 8px" }}
      />
      <div
        className="skeleton-block"
        style={{ height: "1em", width: "88%", margin: "0 auto 8px" }}
      />

      <MonthGrid weekdays={weekdays} />

      {showNextMonth && <NextMonthSkeleton weekdays={weekdays} />}
    </>
  );
}
