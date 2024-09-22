"use client";
import MusicServices from "@/entities/MusicServices/MusicServices";
import TarifCard from "@/entities/TarifCard/TarifCard";
import TarifTable from "@/entities/TarifTable/TarifTable";
import { PageTransitionProvider } from "@/providers/PageTransitionProvider";
import MyText from "@/shared/MyText/MyText";
import MyTitle from "@/shared/MyTitle/MyTitle";
import classNames from "classnames";
import EnterprizeIcon from "@/entities/TarifCard/TarifsIcons/Enterprize.svg";
import PROIcon from "@/entities/TarifCard/TarifsIcons/PRO.svg";
import StandartIcon from ".@/entities/TarifCard/TarifsIcons/Standart.svg";
import { ArrayTarifTable } from "@/entities/TarifTable/TarifTable.props";
import style from "./page.module.css";
import ITarifTable from "@/entities/TarifTable/TarifTable.props";
import TopMine from "@/public/assets/TopMine.svg";
import ArrowsUp3Icon from "@/public/assets/ArrowsUp/arrowsUp3.svg";
import ArrowsUp2Icon from "@/public/assets/ArrowsUp/arrowsUp2.svg";
import ArrowsUp1Icon from "@/public/assets/ArrowsUp/arrowsUp1.svg";
import { premiumPlans } from "@/helpers/premiumPlans";
import { DynamicSvg } from "@/shared/DynamicSvg/DynamicSvg";
import { Suspense } from "react";
export default function TarifPage() {
  return (
    <PageTransitionProvider>
      <div className={style.info}>
        <div className={style.relative}>
          <TopMine
            className={classNames(style.mineIcon, style.absolute, style.pulse)}
          />
          <TopMine
            className={classNames(
              style.mineIcon,
              style.absolute,
              style.blur_small,
              style.pulse
            )}
          />
          <TopMine
            className={classNames(
              style.mineIcon,
              style.absolute,
              style.blur_medium,
              style.pulse
            )}
          />
          <TopMine
            className={classNames(
              style.mineIcon,
              style.absolute,
              style.big,
              style.pulse
            )}
          />
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
            />
          );
        })}
        {/* <TarifCard
          border={false}
          icon={<ArrowsUp1Icon className={style.icon} />}
          name="Стандарт"
          desc={
            "Подписка для тех, кто хочет попробовать и не настроен серьезно на своё творчество."
          }
          price={890}
          markers={[
            "Один релиз в месяц 😔",
            "Дистрибуция за 5 дней",
            "Идеально для новичков",
          ]}
        /> */}
        {/* <TarifCard
          border={true}
          icon={
            <ArrowsUp3Icon className={classNames(style.icon, style.active)} />
          }
          name="Энтерпрайз"
          desc={
            "Идеальное решение для настоящих артистов, настроеных на получение результатов."
          }
          price={1490}
          markers={[
            "Безлимитные релизы",
            "Выгрузка на площадки от 1 часа",
            "Приоритетная поддержка с личным менеджером",
            "100% роялти",
            "Приоритетная модерация",
            "Премиальные функции",
          ]}
        />
        <TarifCard
          border={false}
          icon={<ArrowsUp2Icon className={style.icon} />}
          name="PRO"
          desc={
            "План для тех, у кого строго ограничен бюджет но тем не менее он хочет быть услышанным."
          }
          price={1190}
          markers={[
            "До 6 релизов в месяц",
            "Выгрузка на площадки до 3-х дней",
            "Персональная поддержка",
          ]}
        /> */}
      </div>
      <TarifTable data={ArrayTarifTable as ITarifTable[]} />
    </PageTransitionProvider>
  );
}
