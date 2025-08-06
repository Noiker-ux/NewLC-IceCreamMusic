"use client";
import { ReactNode, createContext } from "react";
import { useState } from "react";

export const ThemeContextSite = createContext({
  theme: "dark",
  setTheme: (str: "dark" | "light") => {},
});

export const ThemeContextSiteProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  return (
    <ThemeContextSite.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContextSite.Provider>
  );
};
