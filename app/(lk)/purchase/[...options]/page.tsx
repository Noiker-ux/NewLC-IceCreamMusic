"use client";
import { makePayment } from "@/actions/payments";
// import Header from "@/entities/Header/Header";
import { Error } from "@/entities/Error";
import style from "./page.module.css";
import Image from "next/image";
import MyTitle from "@/shared/MyTitle/MyTitle";
import MyText from "@/shared/MyText/MyText";
import { CardList } from "../../../../helpers/CardList";
import { useState } from "react";
import classNames from "classnames";
export default function PurchasePage({
  params,
}: {
  params: { options: string[] };
}) {
  const [type, level_or_id] = params.options;
  const [selectCard, setSelectCard] = useState("");

  if (type !== "subscription" && type !== "release") {
    return <Error statusCode={404} />;
  }

  // if (type === "subscripttion") {

  // }

  // if (type === "release") {

  // }

  return (
    <div>
      <MyTitle Tag={"h2"}>Выберите способ оплаты</MyTitle>
      <MyText>
        Нажимая на кнопку, вы соглашаетесь с Условиями обработки персональных
        данных, а также с Условиями продажи
      </MyText>
      <div className={style.CardList}>
        {CardList.map((card) => (
          <div
            key={card.alt}
            className={classNames(style.wrapCard, {
              [style.selectCard]: card.alt === selectCard,
            })}
            onClick={() => setSelectCard(card.alt)}
          >
            <Image
              className={style.imageCard}
              src={card.src}
              alt={card.alt}
              width={250}
              height={80}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
