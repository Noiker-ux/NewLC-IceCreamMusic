"use client";
import MyInput from "@/shared/MyInput/MyInput";
import style from "./ProfileWidget.module.css";
import classNames from "classnames";
import { LiaLinkSolid } from "react-icons/lia";

import { LiaTelegramPlane } from "react-icons/lia";
import { SlSocialVkontakte } from "react-icons/sl";
import { useState } from "react";
import Avatar from "./Avatar/Avatar";
import MyTitle from "@/shared/MyTitle/MyTitle";
import Image from "next/image";
import MyText from "@/shared/MyText/MyText";
import MyButton from "@/shared/MyButton/MyButton";

const ProfileWidget = () => {
  const [showEditProfile, setShowEditProfile] = useState<boolean>(false);

  const handleEditProfile = () => {
    setShowEditProfile(true);
  };
  const handleClose = () => {
    setShowEditProfile(false);
  };

  return (
    <>
      <div className="backdor">
        {!showEditProfile ? (
          <>
            <Image
              alt="Аватарка"
              className={style.avatar}
              src={"/assets/avatar.jpg"}
              width={250}
              height={250}
            />
            <div className={style.info}>
              <MyText className={style.nickname}>Noiker</MyText>
              <MyText className={style.login}>noiker01@mail.ru</MyText>
            </div>
            <MyButton
              className={style.btnShow}
              view="secondary"
              text="Редактировать профль"
              onClick={handleEditProfile}
            ></MyButton>
          </>
        ) : (
          <form>
            <div className={style.MainInfo}>
              <Avatar />
              <div className={style.social}>
                <MyInput
                  view="dls"
                  placeholder="Фамилия"
                  label={"Фамилия"}
                  type={"text"}
                />
                <MyInput label={"Имя"} type={"text"} />
                <MyInput label={"Отчество"} type={"text"} />
                <MyInput label={"Дата рождения"} type={"date"} />
              </div>
            </div>
            <div className={style.wrapLink}>
              <SlSocialVkontakte className={style.icon} />
              <MyInput label={"Ссылка на личную страничку VK"} type={"text"} />
            </div>
            <div className={style.wrapLink}>
              <LiaTelegramPlane className={style.icon} />
              <MyInput label={"Ссылка на Telegramm"} type={"text"} />
            </div>
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

            <div className={style.col}>
              <MyButton text="Сохранть" view="primary" />
              <MyButton text="Закрыть" view="secondary" onClick={handleClose} />
            </div>
          </form>
        )}
      </div>
    </>
  );
};
export default ProfileWidget;
