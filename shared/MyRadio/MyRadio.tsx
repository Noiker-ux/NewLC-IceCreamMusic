import style from "./MyRadio.module.css";
import { forwardRef } from "react";
import IMyRadioProps from "./MyRadio.props";
import classNames from "classnames";

const MyRadio = forwardRef<HTMLInputElement, IMyRadioProps>(function MyCheckbox(
  { label, className, ...props },
  ref
) {
  return (
    <label className={style.label}>
      <input
        type="radio"
        className={classNames(style.input, className)}
        ref={ref}
        {...props}
      />
      {label}
    </label>
  );
});

export default MyRadio;
