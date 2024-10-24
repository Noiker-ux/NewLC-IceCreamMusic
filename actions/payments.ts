"use server";

import { checkout } from "@/config/aquiring";
import { db } from "@/db";
import { Payment } from "@a2seven/yoo-checkout";
import { redirect } from "next/navigation";
import { getAuthSession } from "./auth";
import { getFullUrl } from "./url";
import { orders, payouts, users } from "@/db/schema";
import { premiumPlans } from "@/helpers/premiumPlans";
import {
  currency,
  calculateSubscriptionEstimate,
  calculateReleaseEstimate,
} from "@/utils/calculateServices";
import { eq } from "drizzle-orm";
import dateFormatter from "@/utils/dateFormatter";

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

  if (!session || !session.user) {
    return unauthorizedResult;
  }

  const fullUrl = await getFullUrl();

  const urlOrigin = new URL(fullUrl).origin;

  let returnPath: string = "";

  let orderMetadata: Omit<typeof forWhat, "type"> = {};

  let receiptItems: Payment["receipt"]["items"] = [];

  let paymentDescription = "";

  if (forWhat.type === "release") {
    const user = await db.query.users.findFirst({
      where: (user, { eq }) => eq(user.id, session.user!.id!),
      with: {
        releases: { where: (rel, { eq }) => eq(rel.id, forWhat.releaseId) },
      },
    });

    if (!user) {
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
        return_url: `${urlOrigin}${returnPath}`,
      },
      description: paymentDescription,
      receipt: {
        items: receiptItems,
        tax_system_code: 1,
        customer: {
          email: session.user.email,
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
    userId: session.user.id,
    metadata: orderMetadata,
  });

  redirect(payment.confirmation.confirmation_url);
}

export async function topUp(userId: string, amount: number) {
  const session = await getAuthSession();

  if (!session || !session.user || !session.user.id) {
    return { success: false, message: "You need to log in first." };
  }

  const admin = await db.query.users.findFirst({
    where: (us, { and, eq }) =>
      and(eq(us.id, session.user!.id), eq(us.isAdmin, true)),
  });

  if (!admin) {
    return {
      success: false,
      message: "You must be admin to perform this operation.",
    };
  }

  await db.update(users).set({ balance: amount }).where(eq(users.id, userId));

  return { success: true };
}

export async function makePayout(userId: string, payoutToken: string) {
  const session = await getAuthSession();

  if (!session || !session.user || !session.user.id) {
    return { success: false, message: "You need to log in first." };
  }

  const user = await db.query.users.findFirst({
    where: (us, { eq }) => eq(us.id, userId),
  });

  if (!user) {
    return { success: false, message: "You need to log in first." };
  }

  if (user.balance === 0) {
    return {
      success: false,
      message: "Can not make payout. Your balance is 0.",
    };
  }

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
  )
    .json()
    .catch(() => null);

  if (!payout) {
    return { success: false, message: "Smth went wrong" };
  }

  await db.insert(payouts).values({ id: payout.id, userId: user.id });

  return { success: true };
}
