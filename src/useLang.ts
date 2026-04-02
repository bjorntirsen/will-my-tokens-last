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
  }, [lang]);

  return { lang, setLang };
}
