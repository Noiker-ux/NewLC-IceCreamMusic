import { checkout } from "@/config/aquiring";
import { db } from "@/db";
import { orders, payment_method, release, users } from "@/db/schema";
import { premiumPlans } from "@/helpers/premiumPlans";
import {
  releaseMetadataSchema,
  subscriptionMetadataSchema,
} from "@/schema/order.schema";
import { WebHookEvents } from "@a2seven/yoo-checkout";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const goodResponse = NextResponse.json(
    {
      message: "Success",
    },
    { status: 200 }
  );

  const badResponse = NextResponse.json(
    { message: "Bad request" },
    { status: 400 }
  );

  const internalResponse = NextResponse.json(
    { message: "Internal server error" },
    { status: 500 }
  );

  const data = await req.json();

  if (
    data.type !== "notification" ||
    data.event !== WebHookEvents["payment.succeeded"] ||
    !data.object ||
    !data.object.id ||
    !data.object.status
  ) {
    return badResponse;
  }

  const payment = await checkout.getPayment(data.object.id).catch(() => null);

  if (!payment || payment.status !== data.object.status) {
    return badResponse;
  }

  const order = await db.query.orders.findFirst({
    with: {
      user: true,
    },
    where: (ord, { eq }) => eq(ord.id, data.object.id),
  });

  if (!order) {
    return badResponse;
  }

  if (payment.payment_method.saved) {
    await db
      .update(payment_method)
      .set({ isDefault: false })
      .where(eq(payment_method.userId, order.userId));

    await db
      .insert(payment_method)
      .values({
        userId: order.userId,
        id: payment.payment_method.id,
        metadata: payment.payment_method.card,
        isDefault: true,
      })
      .onConflictDoNothing({ target: payment_method.id });
  }

  if (order.confirmed) {
    return goodResponse;
  }

  if (order.type === "release") {
    const res = releaseMetadataSchema.safeParse(order.metadata);

    if (!res.success) {
      return internalResponse;
    }

    await db.transaction(async () => {
      await db
        .update(release)
        .set({
          confirmed: true,
        })
        .where(eq(release.id, res.data.releaseId));
      await db
        .update(orders)
        .set({ confirmed: true })
        .where(eq(orders.id, order.id));
    });
  }

  if (order.type === "subscription") {
    const res = subscriptionMetadataSchema.safeParse(order.metadata);

    if (!res.success) {
      return internalResponse;
    }

    const currentDate = new Date();

    const expireDate = new Date(currentDate);

    expireDate.setMonth(currentDate.getMonth() + 1);
    expireDate.setHours(0);
    expireDate.setMinutes(0);
    expireDate.setSeconds(0);
    expireDate.setMilliseconds(0);

    await db.transaction(async () => {
      await db
        .update(users)
        .set({
          isSubscribed: true,
          subscriptionLevel: res.data.subscriptionLevel,
          subscriptionExpires: expireDate,
          freeReleases: premiumPlans[res.data.subscriptionLevel!].freeReleases,
        })
        .where(eq(users.id, order.user.id));
      await db
        .update(orders)
        .set({ confirmed: true })
        .where(eq(orders.id, order.id));
    });
  }

  return goodResponse;
}
