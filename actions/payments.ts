import { YooCheckout } from "@a2seven/yoo-checkout";
import { randomUUID } from "crypto";

export async function makePayment() {
  const checkout = new YooCheckout({
    shopId: process.env.YOOKASSA_SHOP_ID as string,
    secretKey: process.env.YOOKASSA_SECRET_KEY,
  });

  const operationId = randomUUID();
}
