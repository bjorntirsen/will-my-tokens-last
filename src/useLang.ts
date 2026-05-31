import { useState, useEffect, useRef } from "react";
import { trackEvent } from "./track";

type Lang = "sv" | "en";

export function useLang() {
  const [lang, setLang] = useState<Lang>(() => {
    const saved = localStorage.getItem("lang") as Lang | null;
    if (saved) return saved;

    return navigator.language.toLowerCase().startsWith("sv") ? "sv" : "en";
  });

  const initialTracked = useRef(false);
  const previousLang = useRef<Lang | null>(null);

  useEffect(() => {
    localStorage.setItem("lang", lang);

    document.documentElement.lang = lang;

    if (!initialTracked.current) {
      trackEvent(`initial-lang-${lang}`);
      initialTracked.current = true;
    } else if (previousLang.current !== lang) {
      trackEvent(`switch-lang-${lang}`);
    }

    previousLang.current = lang;

    document.title = lang === "sv" ? "Kommer mina tokens räcka?" : "Will my tokens last?";

    const description =
      lang === "sv"
        ? "Kommer dina tokens räcka… eller blir du tvungen att koda för hand? Se hur många arbetsdagar som är kvar och få kontroll över din användning."
        : "Will your tokens last… or will you be forced to code by hand? Check how many working days are left and get your usage under control.";

    document.querySelector('meta[name="description"]')?.setAttribute("content", description);
  }, [lang]);

  return { lang, setLang };
}
