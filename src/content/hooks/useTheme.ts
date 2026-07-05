import { useCallback, useEffect, useState } from "react";
import { STORAGE_KEYS, type ThemePreference } from "../lib/constants";
import { getValue, setValue } from "../lib/storage";

type EffectiveTheme = "light" | "dark";

function systemPrefersDark(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
}

function resolve(pref: ThemePreference): EffectiveTheme {
  if (pref === "system") return systemPrefersDark() ? "dark" : "light";
  return pref;
}

export function useTheme() {
  const [preference, setPreference] = useState<ThemePreference>("system");
  const [effective, setEffective] = useState<EffectiveTheme>(() =>
    resolve("system"),
  );

  useEffect(() => {
    let active = true;
    void getValue<ThemePreference>(STORAGE_KEYS.theme, "system").then((p) => {
      if (!active) return;
      setPreference(p);
      setEffective(resolve(p));
    });
    return () => {
      active = false;
    };
  }, []);

  // React to OS-level theme changes while preference is "system".
  useEffect(() => {
    if (preference !== "system") return;
    if (typeof window.matchMedia !== "function") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => setEffective(resolve("system"));
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [preference]);

  const cycleTheme = useCallback(() => {
    setPreference((prev) => {
      const next: ThemePreference =
        prev === "light" ? "dark" : prev === "dark" ? "system" : "light";
      setEffective(resolve(next));
      void setValue(STORAGE_KEYS.theme, next);
      return next;
    });
  }, []);

  return { preference, effective, cycleTheme };
}
