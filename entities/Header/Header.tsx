"use client";
import style from "./Header.module.css";
import PlusIcon from "../../public/InfoIcon/Plus.svg";
import NotificationIcon from "../../public/InfoIcon/Notification.svg";
import MyText from "@/shared/MyText/MyText";
import Image from "next/image";
import { useState } from "react";
import ModalPopup from "@/widgets/ModalPopup/ModalPopup";
import MyTitle from "@/shared/MyTitle/MyTitle";
import classNames from "classnames";
import MyButton from "@/shared/MyButton/MyButton";
import moneyFormatter from "@/utils/moneyFormatter";
import { useTheme } from "next-themes";
import { cookies } from "next/headers";
import ThemeToggle from "@/widgets/ThemeToggle/ThemeToggle";

const Header = () => {
  const [showWallet, setShowWallet] = useState(false);

  const handleShowWalletPopup = () => {
    setShowWallet(true);
  };

  return (
    <header className={style.header}>
      <div className={style.headerWrapper}>
        <div className={style.version}>BETA v1.1.2</div>
        <div className={style.header__info}>
          <ThemeToggle />

          <button
            className={style.header__button}
            onClick={handleShowWalletPopup}
          >
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
      </div>
      {showWallet && (
        <ModalPopup
          title="Кошелек"
          active={showWallet}
          setActive={setShowWallet}
          width={0}
          height={450}
        >
          <div className={classNames("center", "col")}>
            <Image
              className={style.image}
              src={"/assets/dollar.png"}
              alt={"Dollar"}
              width={250}
              height={250}
            />
            <MyTitle Tag={"h3"}>Поздравляем!</MyTitle>
            <MyText className={classNames(style.desc, "mt20")}>
              Вы заработали {moneyFormatter(3000)}.
              <br />
              Вместе с нами вы можете раскрыть свой потенциал, развить свои
              таланты и оставить след в мире музыки.{" "}
            </MyText>
            <MyButton
              className="mt30"
              text={`Получить ${moneyFormatter(3000)}`}
              view={"secondary"}
            />
          </div>
        </ModalPopup>
      )}
    </header>
  );
};
export default Header;
