import { Payment } from "@a2seven/yoo-checkout";
import { db } from "../db";
import { premiumPlans } from "../helpers/premiumPlans";

export const currency = "RUB";

const receiptItemBase: Pick<
  Payment["receipt"]["items"][number],
  "vat_code" | "payment_mode" | "payment_subject"
> = {
  vat_code: 1,
  payment_mode: "full_payment",
  payment_subject: "service",
};

export async function calculateSubscriptionEstimate(
  level: keyof typeof premiumPlans
): Promise<Payment["receipt"]["items"]> {
  return [
    {
      ...receiptItemBase,
      amount: {
        currency,
        value: premiumPlans[level].price.toFixed(2),
      },
      description: `Подписка уровня ${premiumPlans[level]}`,
      quantity: (1).toFixed(2),
    },
  ];
}

export async function calculateReleaseEstimate(
  releaseId: string
): Promise<Payment["receipt"]["items"]> {
  const release = await db.query.release.findFirst({
    where: (rel, { eq }) => eq(rel.id, releaseId),
  });

  if (!release) {
    return [];
  }

  return [];
}
