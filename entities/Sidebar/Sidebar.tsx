"use client";

import style from "./Sidebar.module.css";
import SidebarHeader from "./SidebarHeader/SidebarHeader";
import SidebarBody from "./SidebarBody/SidebarBody";
import { TiChevronRight } from "react-icons/ti";
import classNames from "classnames";
import { useSidebarData } from "@/providers/SidebarContext";
import SidebarFooter from "./SidebarFooter/SidebarFooter";

const Sidebar = () => {
  const { size, setSize } = useSidebarData();
  const handleSize = () => {
    size === "full" ? setSize("small") : setSize("full");
  };

  return (
    <aside
      className={classNames(style.sidebar, {
        [style.small]: size === "small",
      })}
    >
      <div className={style.main}>
        <SidebarHeader />
        <SidebarBody />
        <div
          className={classNames(style.swapSize, {
            [style.active]: size === "small",
          })}
          onClick={handleSize}
        >
          <TiChevronRight />
        </div>
      </div>
      <SidebarFooter />
    </aside>
  );
};
export default Sidebar;
