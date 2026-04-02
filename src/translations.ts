export const translations = {
  sv: {
    title: "Kommer mina tokens räcka?",
    monthText: (formatted: string) => `Det är ${formatted}.`,
    remainingDays: (n: number) => `Det är ${n} arbetsdagar kvar på månaden inklusive idag.`,
    percentage: (p: number) =>
      `Om du vill sprida ut dina tokens jämnt över månaden bör du ha ungefär ${p}% kvar.`,
    error: "Misslyckades att hämta helgdagar",
    weekdays: ["Mån", "Tis", "Ons", "Tor", "Fre", "Lör", "Sön"],
    theme: {
      light: "☀️ Ljust",
      dark: "🌙 Mörkt",
      system: "🖥️ System",
    },
  },
  en: {
    title: "Will my tokens last?",
    monthText: (formatted: string) => `It is ${formatted}.`,
    remainingDays: (n: number) => `There are ${n} working days left this month including today.`,
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
