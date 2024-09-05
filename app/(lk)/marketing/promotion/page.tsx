"use client";

import PromotionCard from "@/entities/PromotionCard/PromotionCard";
import { PageTransitionProvider } from "@/providers/PageTransitionProvider";
import style from "./page.module.css";

export default function PromotionPage() {
  return (
    <PageTransitionProvider>
      <div className={style.promotionList}>
        <PromotionCard
          bgColor="#7378D4"
          bgImage={"purpleBG.png"}
          name={"Первичная консультация"}
          newPrice={1499}
          oldPrice={1999}
          promotionList={[
            "Персональная консультация",
            "Базовая оценка перспективности релиза",
          ]}
        />

        <PromotionCard
          bgColor="#FCAC8A"
          bgImage={"orangeBG.png"}
          name={"Первичная консультация и оценка перспективности"}
          newPrice={2499}
          promotionList={[
            "Персональная консультация",
            "Полная оценка перспективности релиза",
            "Полная оценка перспективности по закрытым источникам",
            "Отчет в формате PDF",
          ]}
        />

        <PromotionCard
          bgColor="#48BFB0"
          bgImage={"greenBG.png"}
          name={"Таргет: Базовый"}
          newPrice={7499}
          promotionList={[
            "Персональная консультация",
            "Полная оценка перспективности релиза",
            "Полная оценка перспективности по закрытым источникам",
            "Базовая настройка таргета VK",
            "Отчет в формате PDF",
          ]}
        />

        <PromotionCard
          bgColor="#F07989"
          bgImage={"redBG.png"}
          name={"Таргет: Стандартный"}
          newPrice={8499}
          promotionList={[
            "Персональная консультация",
            "Полная оценка перспективности релиза",
            "Полная оценка перспективности по закрытым источникам",
            "Первичная оценка аудитории",
            "Базовая настройка таргета VK",
            "Отчет в формате PDF",
          ]}
        />

        <PromotionCard
          bgColor="#2EABC9"
          bgImage={"blueBG.png"}
          name={"Расширенный Таргет + TikTok"}
          newPrice={8499}
          promotionList={[
            "Персональная консультация",
            "Полная оценка перспективности релиза",
            "Полная оценка перспективности по закрытым источникам",
            "Глубокая оценка аудитории",
            "Глубокая настройка таргета в VK",
            "Интеграция в TikTok с блогерами",
            "Отчет в формате PDF",
          ]}
        />
      </div>
    </PageTransitionProvider>
  );
}
