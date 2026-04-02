import type { HolidayResponse } from "./useHolidays";

function getDayOfWeek(dateString: string) {
  const day = new Date(dateString).getDay();
  return day === 0 ? 7 : day;
}

function isWeekend(dateString: string) {
  const day = new Date(dateString).getDay();
  return day === 0 || day === 6;
}

export function calculateWorkingDays(dagar: HolidayResponse["dagar"] | undefined) {
  const calendarDays =
    dagar?.map((d) => {
      const weekend = isWeekend(d.datum);
      return {
        ...d,
        dayOfWeek: getDayOfWeek(d.datum),
        isWeekend: weekend,
        isWorkingDay: !d.arbetsfriDag && !weekend,
      };
    }) ?? [];

  const today = new Date().toISOString().slice(0, 10);
  const totalWorkingDays = calendarDays.filter((d) => !d.arbetsfriDag && !d.isWeekend).length;
  const remainingWorkingDays = calendarDays.filter(
    (d) => d.datum >= today && !d.arbetsfriDag && !d.isWeekend,
  ).length;
  const remainingPercentage =
    totalWorkingDays === 0
      ? 0
      : Math.min(100, Math.max(0, Math.round((remainingWorkingDays / totalWorkingDays) * 100)));

  const includesToday = calendarDays.some(
    (d) => d.datum === today && !d.arbetsfriDag && !d.isWeekend,
  );

  return { calendarDays, today, remainingWorkingDays, remainingPercentage, includesToday };
}
