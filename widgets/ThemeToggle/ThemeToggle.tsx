"use client";
import classNames from "classnames";
import style from "./ThemeToggle.module.css";
import { useTheme } from "next-themes";
import { useState } from "react";

const ThemeToggle = () => {
  const { setTheme, theme } = useTheme();
  const [checked, setChecked] = useState(true);

  const handleChangeTheme = () => {
    setChecked((checked) => !checked);
    if (theme === "dark") {
      setTheme("light");
    }
    if (theme === "light" || theme === "system") {
      setTheme("dark");
    }
  };

  return (
    <>
      <input
        defaultChecked={checked}
        onChange={handleChangeTheme}
        type="checkbox"
        id="toggle_checkbox"
        className={style.toggle_checkbox}
      />
      <label className={style.label} htmlFor="toggle_checkbox">
        <div id="star" className={style.starAll}>
          <div className={classNames(style.star, style.star1)} id="star-1">
            ★
          </div>
        </div>
        <div className={style.moon} id="moon"></div>
      </label>
    </>
  );
};
export default ThemeToggle;
