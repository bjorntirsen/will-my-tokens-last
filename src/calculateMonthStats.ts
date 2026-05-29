import type { HolidaysData, HolidayResponse } from "./useHolidays";

function formatMonthYear(date: Date, lang: "sv" | "en") {
  return new Intl.DateTimeFormat(lang === "sv" ? "sv-SE" : "en-US", {
    month: "long",
    year: "numeric",
  }).format(date);
}

function getDayOfWeek(dateString: string) {
  const day = new Date(dateString).getDay();
  return day === 0 ? 7 : day;
}

function isWeekend(dateString: string) {
  const day = new Date(dateString).getDay();
  return day === 0 || day === 6;
}

function buildCalendarDays(dagar: HolidayResponse["dagar"] | undefined) {
  return (
    dagar?.map((d) => {
      const weekend = isWeekend(d.datum);
      return {
        ...d,
        dayOfWeek: getDayOfWeek(d.datum),
        isWeekend: weekend,
        isWorkingDay: !d.arbetsfriDag && !weekend,
      };
    }) ?? []
  );
}

export function calculateMonthStats(holidaysData: HolidaysData | null, lang: "sv" | "en") {
  const calendarDays = buildCalendarDays(holidaysData?.current.dagar);
  const nextMonthCalendarDays = buildCalendarDays(holidaysData?.next.dagar);

  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const currentMonthLabel = formatMonthYear(now, lang);
  const nextMonthLabel = formatMonthYear(new Date(now.getFullYear(), now.getMonth() + 1, 1), lang);
  const totalWorkingDays = calendarDays.filter((d) => !d.arbetsfriDag && !d.isWeekend).length;
  const remainingWorkingDays = calendarDays.filter(
    (d) => d.datum >= today && !d.arbetsfriDag && !d.isWeekend,
  ).length;
  const remainingPercentage =
    totalWorkingDays === 0
      ? 0
      : Math.min(100, Math.max(0, Math.round((remainingWorkingDays / totalWorkingDays) * 100)));

  const endOfDayPercentage =
    totalWorkingDays === 0
      ? 0
      : Math.min(
          100,
          Math.max(0, Math.round(((remainingWorkingDays - 1) / totalWorkingDays) * 100)),
        );

  const includesToday = calendarDays.some(
    (d) => d.datum === today && !d.arbetsfriDag && !d.isWeekend,
  );

  const nextMonthWorkingDays = nextMonthCalendarDays.filter(
    (d) => !d.arbetsfriDag && !d.isWeekend,
  ).length;

  return {
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
  };
}
