export const translations = {
  sv: {
    title: "Kommer mina tokens räcka?",
    monthText: (formatted: string) => `Det är ${formatted}.`,
    remainingDays: (n: number, includesToday: boolean) => {
      if (n === 0)
        return "Det finns inga arbetsdagar kvar den här månaden. Hoppas du använde dina tokens väl.";
      if (n === 1)
        return includesToday
          ? "Det är 1 arbetsdag kvar den här månaden, inklusive idag."
          : "Det är 1 arbetsdag kvar den här månaden.";
      return includesToday
        ? `Det är ${n} arbetsdagar kvar den här månaden, inklusive idag.`
        : `Det är ${n} arbetsdagar kvar den här månaden.`;
    },
    percentage: (startP: number, endP: number, includesToday: boolean) =>
      includesToday
        ? `Om du vill hålla jämn takt bör du ha ungefär ${startP}% i början av dagen och ${endP}% när arbetsdagen är slut.`
        : `Om du vill hålla jämn takt bör du ha ungefär ${startP}% i början av nästa arbetsdag och ${endP}% i slutet av den.`,
    viewNextMonth: "Visa nästa månad",
    nextMonthText: (formatted: string) => formatted,
    hideNextMonth: "Dölj nästa månad",
    nextMonthDays: (n: number) =>
      n === 1 ? "Nästa månad har 1 arbetsdag." : `Nästa månad har ${n} arbetsdagar.`,
    error: "Misslyckades att hämta helgdagar",
    weekdays: ["mån", "tis", "ons", "tor", "fre", "lör", "sön"],
    theme: {
      light: "☀️ Ljust",
      dark: "🌙 Mörkt",
      system: "🖥️ System",
    },
  },
  en: {
    title: "Will my tokens last?",
    monthText: (formatted: string) => `It's ${formatted}.`,
    remainingDays: (n: number, includesToday: boolean) => {
      if (n === 0)
        return "There are no workdays left this month. I hope you put those tokens to good use.";
      if (n === 1)
        return includesToday
          ? "There is 1 working day left this month, including today."
          : "There is 1 working day left this month.";
      return includesToday
        ? `There are ${n} working days left this month, including today.`
        : `There are ${n} working days left this month.`;
    },
    percentage: (startP: number, endP: number, includesToday: boolean) =>
      includesToday
        ? `If you want to stay on pace, you should have about ${startP}% at the start of the day and ${endP}% by the end of it.`
        : `If you want to stay on pace, you should have about ${startP}% at the start of the next workday and ${endP}% at the end of it.`,
    viewNextMonth: "View next month",
    nextMonthText: (formatted: string) => formatted,
    hideNextMonth: "Hide next month",
    nextMonthDays: (n: number) =>
      n === 1 ? "Next month has 1 working day." : `Next month has ${n} working days.`,
    error: "Failed to fetch holidays",
    weekdays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    theme: {
      light: "☀️ Light",
      dark: "🌙 Dark",
      system: "🖥️ System",
    },
  },
};
