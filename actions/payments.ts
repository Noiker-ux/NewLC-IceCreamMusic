"use server";

import { Payment, YooCheckout } from "@a2seven/yoo-checkout";
import { randomUUID } from "crypto";
import { getAuthSession } from "./auth";
import { redirect } from "next/navigation";
import { getFullUrl } from "./url";
import { db } from "@/db";
import { release } from "@/db/schema";

const checkout = new YooCheckout({
  shopId: process.env.YOOKASSA_SHOP_ID as string,
  secretKey: process.env.YOOKASSA_SECRET_KEY as string,
});

export async function makePayment(
  forWhat: { type: "subscription" } | { type: "release"; releaseId: string },
  by: Payment["payment_method_data"]["type"]
) {
  const session = await getAuthSession();

  if (!session || !session.user) {
    return { success: false, message: "You need to log in first." };
  }

  const fullUrl = await getFullUrl();

  const urlOrigin = new URL(fullUrl).origin;

  let returnPath: string = "";

  if (forWhat.type === "release") {
    returnPath = "/dashboard";
    const userRelease = await db.query.release.findFirst({});
  }

  if (forWhat.type === "subscription") {
    returnPath = "/news";
  }

  const idempotenceKey = randomUUID();

  const payment = await checkout
    .createPayment(
      {
        amount: {
          value: "1000.00",
          currency: "RUB",
        },
        payment_method_data: {
          type: by,
        },
        confirmation: {
          type: "redirect",
          return_url: `${origin}${returnPath}`,
        },
        description: "payment test 1",
        receipt: {
          items: [
            {
              description: "test 1",
              quantity: "1.00",
              amount: {
                value: "1000.00",
                currency: "RUB",
              },
              vat_code: 1,
              payment_mode: "full_payment",
              payment_subject: "service",
            },
          ],
          tax_system_code: 1,
        },
      },
      idempotenceKey
    )
    .catch((e) => {
      console.log(e);
      return null;
    });

  if (!payment || !payment.confirmation.confirmation_url) {
    return { success: false, message: "Smth went wrong" };
  }

  redirect(payment.confirmation.confirmation_url);
}
