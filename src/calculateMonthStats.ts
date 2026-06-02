import type { HolidayResponse } from "./useHolidays";

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

export function calculateMonthStats(
  current: HolidayResponse | null,
  next: HolidayResponse | null,
  lang: "sv" | "en",
  customDaysOff: Record<string, "off" | "half"> = {},
) {
  const calendarDays = buildCalendarDays(current?.dagar);
  const nextMonthCalendarDays = buildCalendarDays(next?.dagar);

  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const currentMonthLabel = formatMonthYear(now, lang);
  const nextMonthLabel = formatMonthYear(new Date(now.getFullYear(), now.getMonth() + 1, 1), lang);

  const customTotalAdj = calendarDays
    .filter((d) => d.isWorkingDay && customDaysOff[d.datum])
    .reduce((s, d) => s + (customDaysOff[d.datum] === "off" ? 1 : 0.5), 0);

  const customRemainingAdj = calendarDays
    .filter((d) => d.datum >= today && d.isWorkingDay && customDaysOff[d.datum])
    .reduce((s, d) => s + (customDaysOff[d.datum] === "off" ? 1 : 0.5), 0);

  const totalWorkingDays = calendarDays.filter((d) => d.isWorkingDay).length - customTotalAdj;
  const remainingWorkingDays =
    calendarDays.filter((d) => d.datum >= today && d.isWorkingDay).length - customRemainingAdj;

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
    (d) => d.datum === today && d.isWorkingDay && customDaysOff[d.datum] !== "off",
  );

  const nextCustomAdj = nextMonthCalendarDays
    .filter((d) => d.isWorkingDay && customDaysOff[d.datum])
    .reduce((s, d) => s + (customDaysOff[d.datum] === "off" ? 1 : 0.5), 0);

  const nextMonthWorkingDays =
    nextMonthCalendarDays.filter((d) => d.isWorkingDay).length - nextCustomAdj;

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
