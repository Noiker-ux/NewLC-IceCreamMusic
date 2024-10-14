"use server";

import { checkout } from "@/config/aquiring";
import { db } from "@/db";
import { Payment } from "@a2seven/yoo-checkout";
import { redirect } from "next/navigation";
import { getAuthSession } from "./auth";
import { getFullUrl } from "./url";
import { orders } from "@/db/schema";
import { premiumPlans } from "@/helpers/premiumPlans";
import {
  currency,
  calculateSubscriptionEstimate,
  calculateReleaseEstimate,
} from "@/utils/calculateServices";

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
