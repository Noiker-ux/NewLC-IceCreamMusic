"use client";
import ChartItem from "@/entities/ChartItem/ChartItem";
import { PageTransitionProvider } from "@/providers/PageTransitionProvider";
import style from "./page.module.css";

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
