import { NextResponse } from "next/server";
// import { revalidateCurrentPath } from "../../../../actions/revalidate";
import { checkout } from "@/config/aquiring";
import { WebHookEvents } from "@a2seven/yoo-checkout";
import { db } from "@/db";
// import { cookies } from "next/headers";
export async function POST(req: Request) {
  const data = await req.json();

  if (
    data.type !== "notification" &&
    data.event === WebHookEvents["payment.succeeded"]
  ) {
    return NextResponse.json({ message: "Bad request" }, { status: 400 });
  }

  if (!data.object || !data.object.id || !data.object.status) {
    return NextResponse.json({ message: "Bad request" }, { status: 400 });
  }

  const payment = await checkout.getPayment(data.object.id).catch(() => null);

  if (!payment || payment.status !== data.object.status) {
    return NextResponse.json({ message: "Bad request" }, { status: 400 });
  }

  const order = await db.query.orders.findFirst({
    where: (ord, { eq }) => eq(ord.id, data.object.id),
    with: {
      user: true,
    },
  });

  if (!order) {
    return NextResponse.json({ message: "Bad request" }, { status: 400 });
  }

  console.log(order);

  return NextResponse.json(
    {
      message: `hello zrok`,
    },
    { status: 200 }
  );
}
