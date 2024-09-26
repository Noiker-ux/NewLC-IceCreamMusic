"use client";
import MusicServices from "@/entities/MusicServices/MusicServices";
import TarifCard from "@/entities/TarifCard/TarifCard";
import TarifTable from "@/entities/TarifTable/TarifTable";
import ITarifTable, {
  ArrayTarifTable,
} from "@/entities/TarifTable/TarifTable.props";
import { premiumPlans } from "@/helpers/premiumPlans";
import { PageTransitionProvider } from "@/providers/PageTransitionProvider";
import TopMine from "@/public/assets/TopMine.svg";
import { DynamicSvg } from "@/shared/DynamicSvg/DynamicSvg";
import MyText from "@/shared/MyText/MyText";
import MyTitle from "@/shared/MyTitle/MyTitle";
import classNames from "classnames";
import style from "./page.module.css";

const pulseIconClasses = ["", style.blur_small, style.blur_medium, style.big];

export default function TarifPage() {
  return (
    <PageTransitionProvider>
      <div className={style.info}>
        <div className={style.relative}>
          {pulseIconClasses.map((cn) => (
            <TopMine
              key={cn}
              className={classNames(
                style.mineIcon,
                style.absolute,
                cn,
                style.pulse
              )}
            />
          ))}
        </div>
        <MyTitle className={style.title} Tag="h2">
          Всего один шаг до известности
        </MyTitle>
        <MyText className={style.text}>
          Станьте частью частного и приватного лобби лучших артистов в
          музыкальной индустрии по цене обеда! Хватит упускать возможности —
          пора действовать, остальное мы сделаем за вас
        </MyText>
      </div>
      <MusicServices />
      <hr className={style.sepparator} />
      <div className={style.tarifs}>
        {premiumPlans.map((plan) => {
          const { src, border, desc, markers, name, price } = plan;
          return (
            <TarifCard
              icon={<DynamicSvg name={src} className={style.icon} />}
              desc={desc}
              border={border}
              markers={markers as any}
              name={name}
              price={price}
              key={src}
            />
          );
        })}
      </div>
      <TarifTable data={ArrayTarifTable as ITarifTable[]} />
    </PageTransitionProvider>
  );
}
