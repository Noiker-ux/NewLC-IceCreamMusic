"use client";
import { forwardRef } from "react";
import style from "./MyButton.module.css";
import IMyButtonProps from "./MyButton.props";
import classNames from "classnames";
import { oswald, open } from "@/fonts";

const MyButton = forwardRef<HTMLButtonElement, IMyButtonProps>(
  function MyButton({ text, view, className, ...props }, ref) {
    return (
      <button
        className={classNames(style.button, className, {
          [`${style.primary} ${oswald.className}`]: view === "primary",
          [`${style.secondary} ${open.className}`]: view === "secondary",
        })}
        ref={ref}
        {...props}
      >
        {text}
      </button>
    );
  }
);

export default MyButton;
