"use client";

import { createContext, useContext } from "react";
import type { Theme } from "./index";

const ThemeContext = createContext<Theme>("system");

// The server renders data-theme in the first response, and globals.css derives
// the color scheme from it, so the right theme paints before hydration.
export function ThemeProvider({
  theme,
  children,
}: {
  theme: Theme;
  children: React.ReactNode;
}) {
  return (
    <ThemeContext.Provider value={theme}>
      <div data-theme={theme} className="contents">
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
