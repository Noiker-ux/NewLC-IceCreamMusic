"use client";

import MyTitle from "@/shared/MyTitle/MyTitle";
import { usePathname } from "next/navigation";
import style from "./BreadCrumbs.module.css";
import Link from "next/link";
import { defaultAuthRedirect } from "@/config/auth";

export type TBreadCrumbs = {
  separator?: string;
  home?: string;
};

const BreadCrumbRoutes = {
  charts: "Чарты",
  license: "Верификация",
  marketing: "Маркетинг",
  instruments: "Инструменты",
  promotion: "Продвижение",
};

export function BreadCrumbs({ separator = "/", home }: TBreadCrumbs) {
  const pathname = usePathname();

  const roots = pathname.split("/").filter(Boolean);

  if (roots.length === 1) return null;

  return (
    <div className={style.wrapper}>
      <div className={style.breadCrumbs}>
        {roots.map((root, index) => (
          <>
            <span className={style.breadCrumb}>
              {Object.keys(BreadCrumbRoutes).includes(root)
                ? BreadCrumbRoutes[root as keyof typeof BreadCrumbRoutes]
                : root}
            </span>
            {index !== roots.length - 1 && (
              <span className={style.breadCrumb}>{separator}</span>
            )}
          </>
        ))}
      </div>
      <MyTitle Tag={"h1"} className={style.title}>
        {BreadCrumbRoutes[roots.at(-1) as keyof typeof BreadCrumbRoutes] ??
          roots.at(-1)}
      </MyTitle>
    </div>
  );
}
export default BreadCrumbs;
