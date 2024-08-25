// components/context/theme.tsx
"use client";
import { setCookie } from "cookies-next";
import { ThemeProvider, useTheme } from "next-themes";
import type { ThemeProviderProps } from "next-themes/dist/types";
import { useEffect } from "react";

// Application theme provider
function AppThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <ThemeProvider enableColorScheme {...props}>
      <AppThemeProviderHelper />
      {children}
    </ThemeProvider>
  );
}

// Helper component to set theme in cookie
function AppThemeProviderHelper() {
  const { theme } = useTheme();

  useEffect(() => {
    setCookie("__theme__", theme, {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
      path: "/",
    });
  }, [theme]);

  return null;
}

export default AppThemeProvider;
