import style from "./Header.module.css";
import PlusIcon from "../../public/InfoIcon/Plus.svg";
import NotificationIcon from "../../public/InfoIcon/Notification.svg";
import MyText from "@/shared/MyText/MyText";
import Image from "next/image";

const Header = () => {
  return (
    <header className={style.header}>
      <div className={style.version}>BETA v1.0.7</div>
      <div className={style.header__info}>
        <button className={style.header__button}>
          <div className={style.header__wrapper__icon}>
            <PlusIcon className={style.header__icon} />
          </div>
          0 ₽
        </button>
        <button className={style.header__button}>
          <div className={style.header__wrapper_w_h}>
            <NotificationIcon className={style.header__icon} />
          </div>
        </button>

        <button className={style.noStyle}>
          <div className={style.header__wrapper_avatar}>
            <Image
              className={style.avatar}
              alt="Аватарка"
              src={"/assets/avatar.jpg"}
              height={40}
              width={40}
            />
            <MyText>Noiker</MyText>
          </div>
        </button>
      </div>
    </header>
  );
};
export default Header;
