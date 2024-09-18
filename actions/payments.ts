"use server";
import { YooCheckout } from "@a2seven/yoo-checkout";
import { randomUUID } from "crypto";

export async function makePayment() {
  const checkout = new YooCheckout({
    shopId: process.env.YOOKASSA_SHOP_ID as string,
    secretKey: process.env.YOOKASSA_SECRET_KEY as string,
  });

  const operationId = randomUUID();

  // console.log(operationId);

  try {
    const payment = await checkout.createPayment(
      {
        amount: {
          value: "2.00",
          currency: "RUB",
        },
        payment_method_data: {
          type: "bank_card",
          card: {
            number: "2200000000000004",
            expiry_month: "12",
            expiry_year: "2025",
            csc: "123",
          },
        },
        confirmation: {
          type: "redirect",
          return_url: "http://localhost:3000/catalog",
        },
        // receipt: {
        //   items:
        //   email: "maksim.rizhdestvensky@yandex.ru",
        // },
      },
      operationId
    );

    console.log(payment.id);
  } catch (e) {
    console.log(e);
  }
}
