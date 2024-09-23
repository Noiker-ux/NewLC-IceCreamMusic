// "use client";

import { forwardRef } from "react";
import style from "./MyCheckbox.module.css";
import IMyCheckboxProps from "./MyCheckbox.props";
import classNames from "classnames";
import { Tooltip } from "react-tooltip";
import IIcon from "../../public/InfoIcon/i.svg";

const MyCheckbox = forwardRef<HTMLInputElement, IMyCheckboxProps>(
  function MyCheckbox({ label, className, tooltip, ...props }, ref) {
    return (
      <div className={style.row}>
        <input
          id={label}
          type="checkbox"
          className={classNames(style.input)}
          ref={ref}
          {...props}
        />
        <label htmlFor={label} className={classNames(style.label, className)}>
          {label}
        </label>
        {tooltip && (
          <div>
            <a data-tooltip-id={tooltip.id} data-tooltip-content={tooltip.text}>
              <IIcon className={style.iIcon} />
            </a>
            <Tooltip
              id={tooltip.id}
              style={{
                backgroundColor: "var(--wrapper-color);",
                color: "var(--light-text-color)",
                fontSize: "12px",
                width: "250px",
              }}
              data-tooltip-place="top-end"
            />
          </div>
        )}
      </div>
    );
  }
);

export default MyCheckbox;
