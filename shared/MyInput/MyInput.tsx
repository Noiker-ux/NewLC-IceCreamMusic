"use client";

import { forwardRef } from "react";
import style from "./MyInput.module.css";
import IMyInputProps from "./MyInput.props";
import classNames from "classnames";

const MyInput = forwardRef<HTMLInputElement, IMyInputProps>(function Input(
  { label, className, type, inpLk, placeholder, ...props },
  ref
) {
  return (
    <div className={classNames(style.fieldHolder, { [style.w30]: inpLk })}>
      <input
        type={type}
        className={classNames(style.input, className, {
          [style.inpLk]: inpLk,
        })}
        placeholder={placeholder}
        ref={ref}
        {...props}
      />
      <label
        className={classNames(style.label, {
          [style.inpLklabel]: inpLk,
        })}
      >
        {label}
      </label>
    </div>
  );
});

export default MyInput;
