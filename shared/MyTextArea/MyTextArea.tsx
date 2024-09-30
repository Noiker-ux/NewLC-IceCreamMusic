"use client";

import { forwardRef } from "react";
import style from "./MyTextArea.module.css";
import IMyTextArea from "./MyTextArea.props";
import classNames from "classnames";
import MyText from "../MyText/MyText";

const MyTextArea = forwardRef<HTMLInputElement, IMyTextArea>(
  function MyTextArea({ className, label, value, ...props }, ref) {
    return (
      <label className={className} htmlFor="textarea">
        <MyText className={style.label}>{label}</MyText>
        <textarea id="textarea" className={style.textarea} {...props}>
          {value}
        </textarea>
      </label>
    );
  }
);

export default MyTextArea;
