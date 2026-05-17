"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

type Theme = "light" | "dark";

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("theme-preference");
    const nextTheme =
      storedTheme === "light" || storedTheme === "dark"
        ? storedTheme
        : window.matchMedia("(prefers-color-scheme: light)").matches
          ? "light"
          : "dark";

    setTheme(nextTheme);
    applyTheme(nextTheme);
    setMounted(true);
  }, []);

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    window.localStorage.setItem("theme-preference", nextTheme);
    applyTheme(nextTheme);
  }

  const Icon = mounted ? (theme === "dark" ? Sun : Moon) : Monitor;
  const label = mounted ? (theme === "dark" ? "Light mode" : "Dark mode") : "Theme";

  return (
    <Button type="button" variant="secondary" size="sm" onClick={toggleTheme} className="gap-2">
      <Icon className="h-4 w-4" />
      {label}
    </Button>
  );
}
