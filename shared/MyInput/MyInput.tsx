"use client";

import { forwardRef } from "react";
import style from "./MyInput.module.css";
import IMyInputProps from "./MyInput.props";
import classNames from "classnames";

const MyInput = forwardRef<HTMLInputElement, IMyInputProps>(function Input(
  { label, className, type, view, placeholder, ...props },
  ref
) {
  return (
    <div className={style.fieldHolder}>
      <input
        type={type}
        className={classNames(style.input, className, {
          [style.dls]: view === "dls",
        })}
        placeholder={placeholder}
        ref={ref}
        {...props}
      />
      <label className={style.label}>{label}</label>
    </div>
  );
});

export default MyInput;
