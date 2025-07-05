import { Payment, YooCheckout } from '@a2seven/yoo-checkout';

export const checkout = new YooCheckout({
  shopId: process.env.YOOKASSA_SHOP_ID as string,
  secretKey: process.env.YOOKASSA_SECRET_KEY as string,
});

export const receiptItemBase: Pick<
  Payment['receipt']['items'][number],
  'vat_code' | 'payment_mode' | 'payment_subject'
> = {
  vat_code: 1,
  payment_mode: 'full_payment',
  payment_subject: 'service',
};

export const currency = 'RUB';
