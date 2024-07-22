"use client";

import { forwardRef } from "react";
import style from "./MyInput.module.css";
import IMyInputProps from "./MyInput.props";
import classNames from "classnames";
// Icons

const MyInput = forwardRef<HTMLInputElement, IMyInputProps>(function Input(
  { label, className, type, ...props },
  ref
) {
  return (
    <div className={style.fieldHolder}>
      <input
        type={type}
        className={classNames(style.input, className)}
        ref={ref}
        required
        pattern="\S+"
        {...props}
      />
      <label className={style.label}>{label}</label>
    </div>
  );
});

export default MyInput;
