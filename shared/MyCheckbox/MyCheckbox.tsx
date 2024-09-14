// "use client";

import { forwardRef } from "react";
import style from "./MyCheckbox.module.css";
import IMyCheckboxProps from "./MyCheckbox.props";
import classNames from "classnames";

const MyCheckbox = forwardRef<HTMLInputElement, IMyCheckboxProps>(
  function MyCheckbox({ label, className, ...props }, ref) {
    return (
      <label className={classNames(style.label, className)}>
        <input
          type="checkbox"
          className={classNames(style.input)}
          ref={ref}
          {...props}
        />
        {label}
      </label>
    );
  }
);

export default MyCheckbox;
