"use client";

import style from "./MyRadio.module.css";
import { forwardRef } from "react";
import IMyRadioProps from "./MyRadio.props";
import classNames from "classnames";
import { Tooltip } from "react-tooltip";
import IIcon from "../../public/InfoIcon/i.svg";
const MyRadio = forwardRef<HTMLInputElement, IMyRadioProps>(function MyCheckbox(
  { label, className, id, name, tooltip, ...props },
  ref
) {
  return (
    <label htmlFor={id} className={style.label}>
      <input
        id={id}
        type="radio"
        name={name}
        className={classNames(style.input, className)}
        ref={ref}
        {...props}
      />
      <span className={style.custom_checkbox}></span>
      <div className={style.row}>
        {label}
        {tooltip && (
          <>
            <a data-tooltip-id={tooltip.id} data-tooltip-content={tooltip.text}>
              <IIcon className={style.iIcon} />
            </a>
            <Tooltip
              id={tooltip.id}
              style={{
                backgroundColor: "var(--wrapper-color)",
                color: "var(--light-text-color)",
                fontSize: "12px",
                width: "250px",
              }}
              data-tooltip-place="top-end"
            />
          </>
        )}
      </div>
    </label>
  );
});

export default MyRadio;
