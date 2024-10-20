"use client";

import { makePayment } from "@/actions/payments";
import MyButton from "@/shared/MyButton/MyButton";

export type TPurchaseConfirm = {
  type: "subscription" | "release";
  levelOrId: string;
};

export function PurchaseConfirm({ levelOrId, type }: TPurchaseConfirm) {
  return (
    <>
      <MyButton
        text="Оплатить"
        view="secondary"
        onClick={() =>
          makePayment(
            type === "subscription"
              ? { type, subscriptionLevel: levelOrId as any }
              : { type, releaseId: levelOrId },
            "bank_card"
          )
        }
      />
    </>
  );
}
