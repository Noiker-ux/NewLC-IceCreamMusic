import IMyTextProps from "./MyText.props";
import style from "./MyText.module.css";
import classNames from "classnames";

const MyText = ({ children, className, ...props }: IMyTextProps) => {
  return (
    <p className={classNames(style.p, className)} {...props}>
      {children}
    </p>
  );
};

export default MyText;
