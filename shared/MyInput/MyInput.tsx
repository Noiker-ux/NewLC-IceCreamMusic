"use client";

import { forwardRef } from "react";
import style from "./MyInput.module.css";
import IMyInputProps from "./MyInput.props";
import classNames from "classnames";
import { Tooltip } from "react-tooltip";
import IIcon from "../../public/InfoIcon/i.svg";
import MyText from "../MyText/MyText";

const MyInput = forwardRef<HTMLInputElement, IMyInputProps>(function Input(
  { label, className, type, inpLk, placeholder, tooltip, ...props },
  ref
) {
  return (
    <div
      className={classNames(style.fieldHolder, className, {
        [style.w30]: inpLk,
      })}
    >
      <input
        type={type}
        className={classNames(style.input, {
          [style.inpLk]: inpLk,
        })}
        placeholder={placeholder}
        ref={ref}
        {...props}
      />

      <label
        className={classNames(style.label, style.row, {
          [style.inpLklabel]: inpLk,
        })}
      >
        <MyText>{label}</MyText>
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
      </label>
    </div>
  );
});

export default MyInput;
