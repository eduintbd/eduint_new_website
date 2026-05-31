"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { LocaleProvider } from "@/lib/i18n/context";

type Theme = "light" | "dark";

const ThemeContext = createContext<{
  theme: Theme;
  toggleTheme: () => void;
}>({
  theme: "light",
  toggleTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const pathname = usePathname() ?? "/";
  // The public brand is intentionally light-only (black + lime). Dark mode is
  // confined to the staff /admin console.
  const isAdmin = pathname.startsWith("/admin");

  useEffect(() => {
    if (!isAdmin) {
      setTheme("light");
      document.documentElement.classList.remove("dark");
      return;
    }
    const stored = localStorage.getItem("theme") as Theme | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = stored ?? (prefersDark ? "dark" : "light");
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, [isAdmin]);

  const toggleTheme = () => {
    if (!isAdmin) return; // no theme switching outside the admin console
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <LocaleProvider>
        <ThemeProvider>
          {children}
          <Toaster position="top-right" richColors />
        </ThemeProvider>
      </LocaleProvider>
    </SessionProvider>
  );
}
