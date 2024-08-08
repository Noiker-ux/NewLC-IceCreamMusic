"use client";
import MyInput from "@/shared/MyInput/MyInput";
import style from "./ProfileWidget.module.css";
import classNames from "classnames";
import { LiaLinkSolid } from "react-icons/lia";
import Image from "next/image";
import { LiaTelegramPlane } from "react-icons/lia";
import { SlSocialVkontakte } from "react-icons/sl";
import { useState } from "react";
import Avatar from "./Avatar/Avatar";
import MyTitle from "@/shared/MyTitle/MyTitle";

const ProfileWidget = () => {
  return (
    <form className={style.form}>
      <div className={classNames(style.MainInfo, "backdor")}>
        <Avatar />
        <div className={style.social}>
          <MyInput label={"Фамилия"} type={"text"} />
          <MyInput label={"Имя"} type={"text"} />
          <MyInput label={"Отчество"} type={"text"} />
          <MyInput label={"Дата рождения"} type={"date"} />
        </div>
      </div>

      <div className="backdor">
        <div className={style.wrapLink}>
          <SlSocialVkontakte className={style.icon} />
          <MyInput label={"Ссылка на личную страничку VK"} type={"text"} />
        </div>
        <div className={style.wrapLink}>
          <LiaTelegramPlane className={style.icon} />
          <MyInput label={"Ссылка на Telegramm"} type={"text"} />
        </div>
      </div>

      <div className="backdor">
        <MyTitle Tag="h3" className={style.title}>
          Ссылки на артиста
        </MyTitle>
        <div className={style.wrapLink}>
          <LiaLinkSolid className={style.icon} />
          <MyInput
            className={style.inpLink}
            label={"Ссылка на артиста VK Music"}
            type={"text"}
          />
        </div>
        <div className={style.wrapLink}>
          <LiaLinkSolid className={style.icon} />
          <MyInput label={"Ссылка на артиста Yandex Music"} type={"text"} />
        </div>
        <div className={style.wrapLink}>
          <LiaLinkSolid className={style.icon} />
          <MyInput label={"Ссылка на артиста Spotify"} type={"text"} />
        </div>
        <div className={style.wrapLink}>
          <LiaLinkSolid className={style.icon} />
          <MyInput label={"Ссылка на артиста Apple Music"} type={"text"} />
        </div>
      </div>
    </form>
  );
};
export default ProfileWidget;
