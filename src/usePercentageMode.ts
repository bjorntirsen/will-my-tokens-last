import { useState, useEffect, useRef } from "react";
import { trackEvent } from "./track";

type PercentageMode = "left" | "used";

export function usePercentageMode() {
  const [mode, setMode] = useState<PercentageMode>(() => {
    const saved = localStorage.getItem("percentageMode");
    return saved === "left" ? "left" : "used";
  });

  const initialTracked = useRef(false);
  const previousMode = useRef<PercentageMode | null>(null);

  useEffect(() => {
    localStorage.setItem("percentageMode", mode);

    if (!initialTracked.current) {
      trackEvent(`initial-percentage-${mode}`);
      initialTracked.current = true;
    } else if (previousMode.current !== mode) {
      trackEvent(`switch-percentage-${mode}`);
    }

    previousMode.current = mode;
  }, [mode]);

  return { mode, setMode };
}
