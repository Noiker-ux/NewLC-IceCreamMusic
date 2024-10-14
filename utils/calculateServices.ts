import { Payment } from "@a2seven/yoo-checkout";
import { db } from "../db";
import { premiumPlans } from "../helpers/premiumPlans";
import {
  labelCost,
  paidReleaseCost,
  standardLabelName,
  textSyncCost,
  trackTextCost,
  trackVideoCost,
  videoShotCost,
} from "../helpers/priceList";

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
  releaseId: string,
  level: keyof typeof premiumPlans | "none"
): Promise<Payment["receipt"]["items"]> {
  const release = await db.query.release.findFirst({
    with: {
      tracks: true,
    },
    where: (rel, { eq }) => eq(rel.id, releaseId),
  });

  if (!release) {
    return [];
  }

  const basePrice = paidReleaseCost[level];

  const result: Payment["receipt"]["items"] = [
    {
      ...receiptItemBase,
      amount: {
        currency,
        value: basePrice.toFixed(2),
      },
      description: `Выпуск релиза ${release.title}`,
      quantity: (1).toFixed(2),
    },
  ];

  if (release.labelName !== standardLabelName) {
    result.push({
      ...receiptItemBase,
      amount: {
        currency,
        value: labelCost[level].toFixed(2),
      },
      description: `Изменение лейбла ${release.labelName}`,
      quantity: (1).toFixed(2),
    });
  }

  let trackTexts = 0;

  let trackTextSyncs = 0;

  let trackVideos = 0;

  let trackVideoShots = 0;

  for (let track of release.tracks) {
    if (track.text) trackTexts += 1;

    if (track.text_sync) trackTextSyncs += 1;

    if (track.video) trackVideos += 1;

    if (track.video_shot) trackVideoShots += 1;
  }

  if (trackTexts > 0) {
    result.push({
      ...receiptItemBase,
      amount: {
        currency,
        value: (trackTexts * trackTextCost[level]).toFixed(2),
      },
      description: `Текст к треку`,
      quantity: trackTexts.toFixed(2),
    });
  }

  if (trackTextSyncs > 0) {
    result.push({
      ...receiptItemBase,
      amount: {
        currency,
        value: (trackTextSyncs * textSyncCost[level]).toFixed(2),
      },
      description: `Синхронизация текста к треку`,
      quantity: trackTextSyncs.toFixed(2),
    });
  }

  if (trackVideos > 0) {
    result.push({
      ...receiptItemBase,
      amount: {
        currency,
        value: (trackVideos * trackVideoCost[level]).toFixed(2),
      },
      description: `Видеоролик(и) к ${trackVideos} треку(ам)`,
      quantity: trackVideos.toFixed(2),
    });
  }

  if (trackVideoShots > 0) {
    result.push({
      ...receiptItemBase,
      amount: {
        currency,
        value: (trackVideoShots * videoShotCost[level]).toFixed(2),
      },
      description: `Видео-шот к треку(ам)`,
      quantity: trackVideoShots.toFixed(2),
    });
  }

  return result;
}
