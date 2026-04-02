import { useState, useEffect } from "react";

type Lang = "sv" | "en";

export function useLang() {
  const [lang, setLang] = useState<Lang>(() => {
    const saved = localStorage.getItem("lang") as Lang | null;
    if (saved) return saved;

    return navigator.language.toLowerCase().startsWith("sv") ? "sv" : "en";
  });

  useEffect(() => {
    localStorage.setItem("lang", lang);

    document.documentElement.lang = lang;

    document.title = lang === "sv" ? "Kommer mina tokens räcka?" : "Will my tokens last?";

    const description =
      lang === "sv"
        ? "Kommer dina tokens räcka… eller blir du tvungen att koda för hand? Se hur många arbetsdagar som är kvar och få kontroll över din användning."
        : "Will your tokens last… or will you be forced to code by hand? Check how many working days are left and get your usage under control.";

    const meta = document.querySelector('meta[name="description"]');

    if (meta) {
      meta.setAttribute("content", description);
    }
  }, [lang]);

  return { lang, setLang };
}
