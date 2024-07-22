"use client";

import style from "./SidebarHeader.module.css";
import { useSidebarData } from "@/providers/SidebarContext";
import classNames from "classnames";
import Logo from "@/shared/Logo/Logo";

const SidebarHeader = () => {
  const { size } = useSidebarData();

  return (
    <div className={style.header}>
      <Logo />
      <div
        className={classNames(style.text, { [style.small]: size === "small" })}
      >
        <p className={style.title}>IceCreamMusic</p>
        <p className={style.description}>Все для артиста в одном месте.</p>
      </div>
    </div>
  );
};

export default SidebarHeader;
