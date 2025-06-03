"use server";

import { checkout } from "@/shared/config/aquiring";
import { premiumPlans } from "@/shared/helpers/premiumPlans";
import {
  calculateReleaseEstimate,
  calculateSubscriptionEstimate,
  currency,
} from "@/shared/helpers/calculateServices";
import dateFormatter from "@/shared/utils/dateFormatter";
import { Payment } from "@a2seven/yoo-checkout";
import { db } from "db";
import { orders, payouts } from "db/schema";
import { redirect } from "next/navigation";
import { getAuthSession } from "./auth";

const unauthorizedResult = {
  success: false,
  message: "You need to log in first.",
};

const notYourRelease = {
  success: false,
  message: "This release is not your",
};

export async function makePayment(
  forWhat:
    | {
        type: "subscription";
        subscriptionLevel: keyof typeof premiumPlans;
      }
    | { type: "release"; releaseId: string },
  by: Payment["payment_method_data"]["type"]
) {
  const session = await getAuthSession();

  if (!session) {
    return unauthorizedResult;
  }

  const user = await db.query.users.findFirst({
    where: (user, { eq }) => eq(user.id, session.id),
  });

  if (!user) {
    return unauthorizedResult;
  }

  let returnPath: string = "/dashboard";

  let orderMetadata: Omit<typeof forWhat, "type"> = {};

  let receiptItems: Payment["receipt"]["items"] = [];

  let paymentDescription = "";

  if (forWhat.type === "release") {
    const release = await db.query.release.findFirst({
      where: (rel, { eq }) => eq(rel.id, forWhat.releaseId),
    });

    if (!release) {
      return notYourRelease;
    }

    paymentDescription = "Оплата дистрибуции релиза";

    returnPath = "/dashboard";

    orderMetadata = { releaseId: forWhat.releaseId };

    receiptItems = await calculateReleaseEstimate(
      forWhat.releaseId,
      user.isSubscribed && !!user.subscriptionLevel
        ? user.subscriptionLevel
        : "none"
    );
  }

  if (forWhat.type === "subscription") {
    paymentDescription = `Оплата подписки уровня "${
      premiumPlans[forWhat.subscriptionLevel].name
    }"`;

    returnPath = "/dashboard/news";

    orderMetadata = { subscriptionLevel: forWhat.subscriptionLevel };

    receiptItems = await calculateSubscriptionEstimate(
      forWhat.subscriptionLevel
    );
  }

  const receiptSumma = receiptItems.reduce((res, item) => {
    return res + Number(item.amount.value);
  }, 0);

  if (receiptSumma < 1) {
    return { success: false, message: "Smth went wrong" };
  }

  const payment = await checkout
    .createPayment({
      amount: {
        value: receiptSumma.toFixed(2),
        currency,
      },
      payment_method_data: {
        type: by,
      },
      confirmation: {
        type: "redirect",
        return_url: `${process.env.NEXT_PUBLIC_DOMAIN}${returnPath}`,
      },
      description: paymentDescription,
      receipt: {
        items: receiptItems,
        tax_system_code: 1,
        customer: {
          email: user.email,
        },
      },
    })
    .catch((e) => {
      console.log(e);
      return null;
    });

  if (!payment || !payment.confirmation.confirmation_url) {
    return { success: false, message: "Smth went wrong" };
  }

  const order = await db.insert(orders).values({
    id: payment.id,
    type: forWhat.type,
    userId: session.id,
    metadata: orderMetadata,
  });

  redirect(payment.confirmation.confirmation_url);
}

export async function makePayout(payoutToken: string) {
  const session = await getAuthSession();

  if (!session) {
    return { success: false, message: "You need to log in first." };
  }

  const user = await db.query.users.findFirst({
    where: (us, { eq }) => eq(us.id, session.id),
  });

  if (!user) {
    return { success: false, message: "You need to log in first." };
  }

  if (user.balance === 2000) {
    return {
      success: false,
      message: "Невозможно выполнить выплату при балансе менее 2000 руб.",
    };
  }

  console.log(payoutToken);

  const isSuccess = await db
    .transaction(async (tx) => {
      const payout = await (
        await fetch("https://api.yookassa.ru/v3/payouts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Basic " +
              btoa(
                `${process.env.YOOKASSA_SHOP_ID}:${process.env.YOOKASSA_SECRET_KEY}`
              ),
          },
          body: JSON.stringify({
            amount: {
              value: user.balance.toFixed(2),
              currency: "RUB",
            },
            payout_token: payoutToken,
            description: `Выплата за ${dateFormatter(new Date())}`,
          }),
        })
      ).json();

      await tx.insert(payouts).values({ id: payout.id, userId: user.id });
    })
    .catch(() => false)
    .then(() => true);

  if (!isSuccess) {
    return {
      success: false,
      message: "Что-то пошло не так",
    };
  }

  return {
    success: true,
    message: "Деньги поступят к Вам на счет в ближайшее время",
  };
}
