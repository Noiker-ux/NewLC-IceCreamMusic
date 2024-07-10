import { forwardRef } from "react";
import style from "./MyInput.module.css";
import IMyInputProps from "./MyInput.props";
import classNames from "classnames";

const MyInput = forwardRef<HTMLInputElement, IMyInputProps>(function Input(
  { label, className, ...props },
  ref
) {
  return (
    <label className={style.label}>
      {label}
      <input
        type="text"
        className={classNames(style.input, className)}
        ref={ref}
        {...props}
      />
    </label>
  );
});

export default MyInput;
