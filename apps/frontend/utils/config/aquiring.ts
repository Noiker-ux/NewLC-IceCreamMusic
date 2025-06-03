import { YooCheckout } from "@a2seven/yoo-checkout";

export const checkout = new YooCheckout({
  shopId: process.env.YOOKASSA_SHOP_ID as string,
  secretKey: process.env.YOOKASSA_SECRET_KEY as string,
});
