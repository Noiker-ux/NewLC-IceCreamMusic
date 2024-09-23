"use server";

import { checkout } from "@/config/aquiring";
import { db } from "@/db";
import { Payment } from "@a2seven/yoo-checkout";
import { redirect } from "next/navigation";
import { getAuthSession } from "./auth";
import { getFullUrl } from "./url";
import { orders } from "@/db/schema";
import { premiumPlans } from "@/helpers/premiumPlans";

export async function makePayment(
  forWhat:
    | {
        type: "subscription";
        subscriptionLevel: (typeof premiumPlans)[number]["system_name"];
      }
    | { type: "release"; releaseId: string },
  by: Payment["payment_method_data"]["type"]
) {
  const session = await getAuthSession();

  if (!session || !session.user) {
    return { success: false, message: "You need to log in first." };
  }

  const fullUrl = await getFullUrl();

  const urlOrigin = new URL(fullUrl).origin;

  let returnPath: string = "";

  let orderMetadata: Omit<typeof forWhat, "type"> = {};

  if (forWhat.type === "release") {
    returnPath = "/dashboard";
    orderMetadata = { releaseId: forWhat.releaseId };
    // const userRelease = await db.query.release.findFirst({});
  }

  if (forWhat.type === "subscription") {
    returnPath = "/dashboard/news";
    orderMetadata = { level: forWhat.subscriptionLevel };
  }

  const payment = await checkout
    .createPayment({
      amount: {
        value: "1000.00",
        currency: "RUB",
      },
      payment_method_data: {
        type: by,
      },
      confirmation: {
        type: "redirect",
        return_url: `${urlOrigin}${returnPath}`,
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
