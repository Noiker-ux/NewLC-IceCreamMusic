"use client";
import classNames from "classnames";
import style from "./ModalPopup.module.css";
import MyTitle from "@/shared/MyTitle/MyTitle";
import CloseIcon from "../../public/InfoIcon/close.svg";

const ModalPopup = ({ active, setActive, title, children, width, height }) => {
  return (
    <div
      className={classNames(style.modal, { [style.active]: active })}
      onClick={() => setActive(false)}
    >
      <div
        style={{ width: `${width}`, height: `${height}` }}
        className={classNames(style.modal__content, {
          [style.active_modal]: active,
        })}
        onClick={(e) => e.stopPropagation()}
      >
        <MyTitle Tag="h3" className={style.title}>
          {title}
        </MyTitle>
        <div className={style.close} onClick={() => setActive(false)}>
          <CloseIcon className={style.closeIcon} />
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};
export default ModalPopup;
