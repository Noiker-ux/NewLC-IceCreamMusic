"use client";

import Logo from "@/shared/Logo/Logo";
import style from "./Sidebar.module.css";
import MyTitle from "@/shared/MyTitle/MyTitle";
import MyText from "@/shared/MyText/MyText";
import SidebarHeader from "./SidebarHeader/SidebarHeader";
import Link from "next/link";
import ControlPanelIcon from "./SidebarIcons/TheControlPanel.svg";
import AnalyticIcon from "./SidebarIcons/Analytic.svg";
import WalletIcon from "./SidebarIcons/Wallet.svg";
import MasspostingIcon from "./SidebarIcons/Massposting.svg";
import BitMarketIcon from "./SidebarIcons/BitMarket.svg";
import PromotionIcon from "./SidebarIcons/Promotion.svg";
import LightningIcon from "./SidebarIcons/Lightning.svg";
import LinksIcon from "./SidebarIcons/Links.svg";
import StarsIcon from "./SidebarIcons/Stars.svg";
import SuccessIcon from "./SidebarIcons/Success.svg";
import ChatIcon from "./SidebarIcons/Chat.svg";
import LikeIcon from "./SidebarIcons/Like.svg";
import ArrowIcon from "./SidebarIcons/arrow.svg";

const Sidebar = () => {
  return (
    <aside className={style.sidebar}>
      <SidebarHeader />
      <div className={style.menu}>
        <div className={style.section}>
          <MyText className={style.section__name}>ОСНОВНОЕ</MyText>
          <Link className={style.section__item} href="/dashboard">
            <ControlPanelIcon className={style.section__icon} />
            Панель управления
          </Link>
          <Link className={style.section__item} href="/dashboard/catalog">
            <ControlPanelIcon className={style.section__icon} />
            Мой каталог
          </Link>
          <Link className={style.section__item} href={"#"}>
            <AnalyticIcon className={style.section__icon} />
            Аналитика
          </Link>
          <Link className={style.section__item} href={"#"}>
            <WalletIcon className={style.section__icon} />
            Кошелек
          </Link>
        </div>

        <div className={style.section}>
          <MyText className={style.section__name}>Маркетинг</MyText>
          <Link className={style.section__item} href={"#"}>
            <MasspostingIcon className={style.section__icon} />
            Масспостинг
          </Link>
          <Link className={style.section__item} href={"#"}>
            <BitMarketIcon className={style.section__icon} />
            Маркет битов
          </Link>
          <Link className={style.section__item} href={"/marketing/promotion"}>
            <PromotionIcon className={style.section__icon} />
            Продвижение
          </Link>
          <Link className={style.section__item} href={"/marketing/charts"}>
            <LightningIcon className={style.section__icon} />
            Чарты
          </Link>
        </div>

        <div className={style.section}>
          <MyText className={style.section__name}>Инструменты</MyText>
          <Link className={style.section__item} href={"#"}>
            <LinksIcon className={style.section__icon} />
            Смарт-ссылки
          </Link>
          <Link className={style.section__item} href={"#"}>
            <StarsIcon className={style.section__icon} />
            Генератор
          </Link>
          <Link className={style.section__item} href={"/instruments/license"}>
            <SuccessIcon className={style.section__icon} />
            Верификация
          </Link>
          <Link className={style.section__item} href={"https://t.me/Ckeabrona"}>
            <ChatIcon className={style.section__icon} />
            Поддержка
          </Link>
        </div>

        <div className={style.section}>
          <MyText className={style.section__name}>Премиум</MyText>
          <Link className={style.section__item} href={"/premium/plans"}>
            <LightningIcon className={style.section__icon} />
            Тарифы
          </Link>
          <Link className={style.section__item} href={"/premium/current"}>
            <LikeIcon className={style.section__icon} />
            Мои подписки
          </Link>
        </div>
      </div>
    </aside>
  );
};
export default Sidebar;
