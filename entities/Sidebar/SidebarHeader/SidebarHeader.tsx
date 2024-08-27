"use client";

import Logo from "@/shared/Logo/Logo";
import style from "./SidebarHeader.module.css";
import MyTitle from "@/shared/MyTitle/MyTitle";
import MyText from "@/shared/MyText/MyText";

const SidebarHeader = () => {
  return (
    <div className={style.header}>
      <Logo />
      <div className={style.header__slogan}>
        <MyTitle className={style.name} Tag="h4">
          IceCreamMusic
        </MyTitle>
        <MyText className={style.slogan}>Сервис для лучших</MyText>
      </div>
    </div>
  );
};
export default SidebarHeader;
