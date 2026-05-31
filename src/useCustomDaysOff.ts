import { useState } from "react";
import { trackEvent } from "./track";

type DayStatus = "off" | "half";

function loadFromLocalStorage(monthKeys: string[]): Record<string, DayStatus> {
  const result: Record<string, DayStatus> = {};
  for (const key of monthKeys) {
    try {
      const stored = localStorage.getItem(key);
      if (stored) Object.assign(result, JSON.parse(stored));
    } catch {}
  }
  return result;
}

function saveToLocalStorage(allDaysOff: Record<string, DayStatus>, changedMonthKey: string) {
  // Group by month
  const byMonth: Record<string, Record<string, DayStatus>> = {};
  for (const [date, status] of Object.entries(allDaysOff)) {
    const mk = date.slice(0, 7);
    byMonth[mk] = { ...byMonth[mk], [date]: status };
  }

  if (byMonth[changedMonthKey]) {
    localStorage.setItem(changedMonthKey, JSON.stringify(byMonth[changedMonthKey]));
  } else {
    localStorage.removeItem(changedMonthKey);
  }

  // Keep only 2 most recent months
  const allKeys = Object.keys(localStorage).filter((k) => /^\d{4}-\d{2}$/.test(k));
  const sorted = allKeys.sort().reverse();
  for (const old of sorted.slice(2)) {
    localStorage.removeItem(old);
  }
}

function toMonthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function useCustomDaysOff(): {
  daysOff: Record<string, DayStatus>;
  toggleDay: (date: string) => void;
  clearAll: () => void;
} {
  const now = new Date();
  const currentMonthKey = toMonthKey(now);
  const nextMonthKey = toMonthKey(new Date(now.getFullYear(), now.getMonth() + 1, 1));

  const [daysOff, setDaysOff] = useState<Record<string, DayStatus>>(() =>
    loadFromLocalStorage([currentMonthKey, nextMonthKey]),
  );

  function clearAll() {
    setDaysOff((prev) => {
      const monthKeys = new Set(Object.keys(prev).map((d) => d.slice(0, 7)));
      for (const k of monthKeys) localStorage.removeItem(k);
      return {};
    });
  }

  function toggleDay(date: string) {
    setDaysOff((prev) => {
      const current = prev[date];
      const next: DayStatus | undefined = !current ? "off" : current === "off" ? "half" : undefined;

      if (next) trackEvent("mark-day-off");

      const updated = { ...prev };
      if (next) {
        updated[date] = next;
      } else {
        delete updated[date];
      }

      saveToLocalStorage(updated, date.slice(0, 7));
      return updated;
    });
  }

  return { daysOff, toggleDay, clearAll };
}
