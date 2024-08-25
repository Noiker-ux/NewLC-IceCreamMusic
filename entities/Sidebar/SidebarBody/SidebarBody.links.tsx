import { ReactNode } from "react";
import { IoHome } from "react-icons/io5";
import { FaPenFancy } from "react-icons/fa";
import { FaQuestionCircle } from "react-icons/fa";
import { MdFiberNew } from "react-icons/md";
import { IoSettings } from "react-icons/io5";
import { IoLogOut } from "react-icons/io5";

interface ISidebarLinks {
  label: string;
  href: string;
  icon: ReactNode;
}

export const SidebarLinks: ISidebarLinks[] = [
  {
    label: "Главная",
    href: "/account",
    icon: <IoHome />,
  },
  {
    label: "Новости",
    href: "/news",
    icon: <MdFiberNew />,
  },
  {
    label: "Загрузить релиз",
    href: "/signature",
    icon: <FaPenFancy />,
  },
  {
    label: "FAQ",
    href: "/faq",
    icon: <FaQuestionCircle />,
  },

  {
    label: "Настройки",
    href: "/settings",
    icon: <IoSettings />,
  },

  {
    label: "Выход",
    href: "/signout",
    icon: <IoLogOut />,
  },
];
