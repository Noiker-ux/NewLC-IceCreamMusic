"use client";
import { sendSignUpConfirmEmail } from "@/actions/email";
import { db } from "@/db";
import { users } from "@/db/schema";
import { PageTransitionProvider } from "@/providers/PageTransitionProvider";
import style from "./page.module.css";
import classNames from "classnames";
import ChartItem from "@/entities/ChartItem/ChartItem";

export default function TarifPage() {
  return (
    <PageTransitionProvider>
      <div className={style.filter}>
        <button className={style.filterItem}>Дневной</button>
        <button className={style.filterItem}>Недельный</button>
        <button className={style.filterItem}>Месячный</button>
      </div>
      <ChartItem
        preview="/assets/News/PornStar.jpg"
        artist="Pharaoh"
        link="#"
        position={1}
        songName="Порнозвезда"
      />
    </PageTransitionProvider>
  );
}
