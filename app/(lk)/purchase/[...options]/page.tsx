// "use client";
import { getAuthSession } from "@/actions/auth";
import { db } from "@/db";
import { Error } from "@/entities/Error";
import MyText from "@/shared/MyText/MyText";
import MyTitle from "@/shared/MyTitle/MyTitle";
import {
  calculateReleaseEstimate,
  calculateSubscriptionEstimate,
} from "@/utils/calculateServices";
import { PurchaseConfirm } from "@/widgets/PurchaseConfirm/PurchaseConfirm";
import { Payment } from "@a2seven/yoo-checkout";
import React from "react";
import style from "./page.module.css";
import classNames from "classnames";

export default async function PurchasePage({
  params,
}: {
  params: { options: string[] };
}) {
  // const [selectCard, setSelectCard] = useState("");

  const session = await getAuthSession();

  if (!session || !session.user || !session.user.id) {
    return <Error statusCode={404} />;
  }

  if (params.options.length !== 2) {
    return <Error statusCode={404} />;
  }

  const [type, level_or_id] = params.options;

  if (type !== "subscription" && type !== "release") {
    return <Error statusCode={404} />;
  }

  let receiptItems: Payment["receipt"]["items"] = [];

  if (type === "subscription") {
    if (
      level_or_id !== "standard" &&
      level_or_id !== "professional" &&
      level_or_id !== "enterprise"
    ) {
      return <Error statusCode={404} />;
    }

    receiptItems = await calculateSubscriptionEstimate(level_or_id);
  }

  if (type === "release") {
    const release = await db.query.release.findFirst({
      where: (rel, { eq, and }) =>
        and(eq(rel.id, level_or_id), eq(rel.authorId, session.user!.id)),
      with: {
        author: true,
      },
    });

    if (!release) {
      return <Error statusCode={404} />;
    }

    receiptItems = await calculateReleaseEstimate(
      release.id,
      release.author.subscriptionLevel ?? "none"
    );
  }

  return (
    <div>
      <MyTitle Tag={"h2"}>Подтверждение оплаты</MyTitle>
      <MyText className="mt10">
        Нажимая на кнопку, вы соглашаетесь с Условиями обработки персональных
        данных, а также с Условиями продажи
      </MyText>

      <div className={style.table}>
        <div className={style.td}>Услуга</div>
        <div className={style.td}>Стоимость</div>
        {receiptItems.map((ri) => (
          <React.Fragment key={ri.description}>
            <div className={style.td}>{ri.description}</div>
            <div className={style.td}>{ri.amount.value} руб.</div>
          </React.Fragment>
        ))}
        <div className={classNames(style.td, style.itog, style.bl)}>Итого</div>
        <div className={classNames(style.td, style.itog)}>
          {receiptItems
            .reduce((acc, ri) => acc + Number(ri.amount.value), 0)
            .toFixed(2)}{" "}
          руб.
        </div>
      </div>

      {/* <div className={style.CardList}>
        {CardList.map((card) => (
          <div
            key={card.alt}
            className={classNames(style.wrapCard, {
              [style.selectCard]: card.alt === selectCard,
            })}
            onClick={() => setSelectCard(card.name)}
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
      </div> */}
      <PurchaseConfirm levelOrId={level_or_id} type={type} />
    </div>
  );
}
