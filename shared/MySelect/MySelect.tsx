"use client";

import { forwardRef } from "react";
import style from "./MySelect.module.css";
import IMySelectProps from "./MySelect.props";
import classNames from "classnames";
import Select from "react-select";
import { stat } from "fs";
import MyText from "../MyText/MyText";
import { Tooltip } from "react-tooltip";
import IIcon from "../../public/InfoIcon/i.svg";

const MySelect = forwardRef<HTMLSelectElement, IMySelectProps>(
  function MySelect(
    { options, label, className, tooltip, value, onValueChange, ...props },
    ref
  ) {
    return (
      <div className={classNames(style.wrap, className)}>
        <div className={style.labelWrapper}>
          <MyText className={style.label}>{label}</MyText>
          {tooltip && (
            <>
              <a
                data-tooltip-id={tooltip.id}
                data-tooltip-content={tooltip.text}
              >
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
            </>
          )}
        </div>
        <Select
          className={style.select}
          styles={{
            control: (baseStyles, state) => ({
              ...baseStyles,
              borderColor: `var(--border-color)`,
              background: "var(--wrapper-color)",
              border: state.isFocused ? "1px solid var(--border-color)" : 0,
              boxShadow: "none",
              padding: "3px 10px",
              borderRadius: "7px",
            }),
            option: (provided, state) => ({
              ...provided,
              background: state.isFocused
                ? "var(--border-color)"
                : "var(--wrapper-color)",
              "&:active": {
                background: "var(--border-color)",
              },
              borderBottom: "1px solid var(--border-color)",
              color: state.isSelected
                ? "var(--light-text-color)"
                : "var(--medium-text-color)",
              padding: 15,
              cursor: "pointer",
            }),
          }}
          options={options}
          onChange={onValueChange as any}
          value={value}
        />
      </div>
    );
  }
);

export default MySelect;
