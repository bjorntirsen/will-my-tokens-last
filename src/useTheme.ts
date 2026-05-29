import { useState, useEffect } from "react";

type Theme = "light" | "dark" | "system";

function getSystemTheme(): Exclude<Theme, "system"> {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem("theme");

    if (saved === "light" || saved === "dark" || saved === "system") {
      return saved;
    }

    return "system";
  });

  useEffect(() => {
    localStorage.setItem("theme", theme);

    document.documentElement.dataset.theme = theme === "system" ? getSystemTheme() : theme;
  }, [theme]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const updateTheme = () => {
      if (theme === "system") {
        document.documentElement.dataset.theme = getSystemTheme();
      }
    };

    media.addEventListener("change", updateTheme);

    return () => {
      media.removeEventListener("change", updateTheme);
    };
  }, [theme]);

  return { theme, setTheme };
}
