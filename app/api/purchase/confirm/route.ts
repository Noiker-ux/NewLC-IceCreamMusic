import { NextResponse } from "next/server";
// import { revalidateCurrentPath } from "../../../../actions/revalidate";
import { checkout } from "@/config/aquiring";
import { db } from "@/db";
import { orders, release, users } from "@/db/schema";
import {
  releaseMetadataSchema,
  subscriptionMetadataSchema,
} from "@/schema/order.schema";
import { WebHookEvents } from "@a2seven/yoo-checkout";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  const goodResponse = NextResponse.json(
    {
      message: `hello notification service`,
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
    where: (ord, { eq }) => eq(ord.id, data.object.id),
    with: {
      user: true,
    },
  });

  if (!order) {
    return badResponse;
  }

  if (order.confirmed) {
    return goodResponse;
  }

  if (
    !order.metadata ||
    typeof order.metadata !== "object" ||
    Array.isArray(order.metadata)
  ) {
    return internalResponse;
  }

  if (order.type === "release") {
    const res = releaseMetadataSchema.safeParse(order.metadata);

    if (!res.success) {
      return internalResponse;
    }
    const newRelease = await db
      .update(release)
      .set({
        confirmed: true,
      })
      .where(eq(release.id, res.data.releaseId));
  }

  if (order.type === "subscription") {
    const res = subscriptionMetadataSchema.safeParse(order.metadata);

    if (!res.success) {
      return internalResponse;
    }

    const currentDate = new Date();

    const expireDate = new Date(
      currentDate.setMonth(currentDate.getMonth() + 1)
    );

    const newUser = await db.update(users).set({
      isSubscribed: true,
      subscriptionLevel: res.data.subscriptionLevel,
      subscriptionExpires: expireDate,
    });
  }

  const newOrder = await db
    .update(orders)
    .set({ confirmed: true })
    .where(eq(orders.id, order.id));

  return goodResponse;
}
