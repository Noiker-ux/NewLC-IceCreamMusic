"use client";

import IMyTitleProps from "./MyTitle.props";
import style from "./MyTitle.module.css";
import classNames from "classnames";

const MyTitle = ({ Tag, children, className, ...props }: IMyTitleProps) => {
  return (
    <Tag className={classNames(style.TAG, className)} {...props}>
      {children}
    </Tag>
  );
};

export default MyTitle;
