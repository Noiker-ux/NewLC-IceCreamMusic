import Logo from "@/shared/Logo/Logo";
import style from "./SidebarFooter.module.css";
import Image from "next/image";
import classNames from "classnames";
import { useSidebarData } from "@/providers/SidebarContext";
import Link from "next/link";
import ThemeToggle from "@/widgets/ThemeToggle/ThemeToggle";

const SidebarFooter = () => {
  const { size } = useSidebarData();
  return (
    <div>
      <ThemeToggle />
      <Link href={"/profile"} className={style.footer}>
        <Image
          alt="Аватарка"
          src={"/assets/avatar.jpg"}
          width={50}
          height={50}
          className={style.avatar}
        />
        <div
          className={classNames(style.text, {
            [style.small]: size === "small",
          })}
        >
          <p className={style.title}>Noiker</p>
          <p className={style.description}>Super Profile</p>
        </div>
      </Link>
    </div>
  );
};
export default SidebarFooter;
