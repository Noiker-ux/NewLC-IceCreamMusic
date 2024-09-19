"use server";

import { YooCheckout } from "@a2seven/yoo-checkout";
import { randomUUID } from "crypto";
import { getAuthSession } from "./auth";
import { redirect } from "next/navigation";

const checkout = new YooCheckout({
  shopId: process.env.YOOKASSA_SHOP_ID as string,
  secretKey: process.env.YOOKASSA_SECRET_KEY as string,
});

export async function makePayment() {
  const session = await getAuthSession();

  if (!session || !session.user) {
    return { success: false, message: "You need to log in first." };
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
          type: "bank_card",
        },
        confirmation: {
          type: "redirect",
          return_url: "http://localhost:3000/dashboard/catalog",
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
          customer: { email: "qwe@qwe.qwe" },
          tax_system_code: 1,
        },
      },
      idempotenceKey
    )
    .catch((e) => {
      console.log(e.data);
      return null;
    });

  if (!payment || !payment.confirmation.confirmation_url) {
    return { success: false, message: "Smth went wrong" };
  }

  redirect(payment.confirmation.confirmation_url);
}
