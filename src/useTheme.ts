import { useState, useEffect } from "react";

type Theme = "light" | "dark" | "system";

const COLOR_SCHEME_QUERY = "(prefers-color-scheme: dark)";

const isBrowser = typeof window !== "undefined";

function getSystemTheme(): Exclude<Theme, "system"> {
  if (!isBrowser) return "light";
  return window.matchMedia(COLOR_SCHEME_QUERY).matches ? "dark" : "light";
}

function resolveTheme(theme: Theme): "light" | "dark" {
  return theme === "system" ? getSystemTheme() : theme;
}

function isTheme(value: unknown): value is Theme {
  return value === "light" || value === "dark" || value === "system";
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (!isBrowser) return "light";

    const saved = localStorage.getItem("theme");
    if (isTheme(saved)) return saved;

    return "system";
  });

  useEffect(() => {
    if (!isBrowser) return;

    localStorage.setItem("theme", theme);
    document.documentElement.dataset.theme = resolveTheme(theme);
  }, [theme]);

  useEffect(() => {
    if (!isBrowser) return;

    const media = window.matchMedia(COLOR_SCHEME_QUERY);

    const update = () => {
      if (theme === "system") {
        document.documentElement.dataset.theme = getSystemTheme();
      }
    };

    update();

    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [theme]);

  return { theme, setTheme };
}
