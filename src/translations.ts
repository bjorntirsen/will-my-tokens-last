export const translations = {
  sv: {
    title: "Kommer mina tokens räcka?",
    monthText: (formatted: string) => `Det är ${formatted}.`,
    remainingDays: (n: number, includesToday: boolean) =>
      includesToday
        ? `Det är ${n} arbetsdagar kvar den här månaden inklusive idag.`
        : `Det är ${n} arbetsdagar kvar den här månaden.`,
    percentage: (p: number) =>
      `Om du vill sprida ut dina tokens jämnt över månaden bör du ha ungefär ${p}% kvar.`,
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
    monthText: (formatted: string) => `It is ${formatted}.`,
    remainingDays: (n: number, includesToday: boolean) =>
      includesToday
        ? `There are ${n} working days left this month including today.`
        : `There are ${n} working days left this month.`,
    percentage: (p: number) =>
      `If you want to spread your tokens evenly, you should have about ${p}% left.`,
    error: "Failed to fetch holidays",
    weekdays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    theme: {
      light: "☀️ Light",
      dark: "🌙 Dark",
      system: "🖥️ System",
    },
  },
};
