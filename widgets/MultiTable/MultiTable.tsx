import classNames from "classnames";
import style from "./MultiTable.module.css";
import Image from "next/image";
import MyText from "@/shared/MyText/MyText";
import dateFormatter from "@/utils/dateFormatter";
import IMultiTable from "./MultiTable.props";

const MultiTable = ({ className, ...props }: IMultiTable) => {
  return (
    <div className={classNames(style.wrapper, className)} {...props}>
      <div className={style.header}></div>
      <div className={style.body}></div>
      <div className={style.footer}></div>
    </div>
  );
};
export default MultiTable;
