import { inArray, lt } from "drizzle-orm";
import schedule from "node-schedule";
import { db } from "../db";
import { orders, users } from "../db/schema";
import { premiumPlans } from "../helpers/premiumPlans";
import { TSubscriptionMetadata } from "../schema/order.schema";
import { calculateSubscriptionEstimate } from "../utils/calculateServices";
import { checkout } from "./aquiring";

async function checkUsers() {
  console.log("updating subscriptions");

  const currentMoment = new Date();

  const usersWithSubscriptionExpired = await db.query.users.findMany({
    with: {
      payment_methods: true,
    },
    where: lt(users.subscriptionExpires, currentMoment),
  });

  if (usersWithSubscriptionExpired.length === 0) {
    console.log("No match users");
    return;
  }

  const expiredUsers: string[] = [];

  for (let user of usersWithSubscriptionExpired) {
    if (!user.subscriptionLevel) continue;

    const paymentMethod = user.payment_methods.find((m) => m.isDefault);

    if (!paymentMethod) {
      expiredUsers.push(user.id);
      continue;
    }

    const payment = await checkout
      .createPayment({
        amount: {
          value: premiumPlans[user.subscriptionLevel].price.toFixed(2),
          currency: "RUB",
        },
        receipt: {
          items: await calculateSubscriptionEstimate(user.subscriptionLevel),
          tax_system_code: 1,
          customer: {
            email: user.email,
          },
        },

        payment_method_id: paymentMethod.id,

        description: `Оплата подписки уровня ${
          premiumPlans[user.subscriptionLevel].name
        }`,
      })
      .catch((e) => {
        console.log(e);
        return null;
      });
    user.subscriptionLevel;
    if (payment) {
      await db.insert(orders).values({
        id: payment.id,
        type: "subscription",
        userId: user.id,
        metadata: {
          subscriptionLevel: user.subscriptionLevel,
        } as TSubscriptionMetadata,
      });
    }
  }

  const updatedSubscriptions = await db
    .update(users)
    .set({ isSubscribed: false })
    .where(inArray(users.id, expiredUsers))
    .returning({ id: users.id });

  console.log(
    `updated subscription status for ${updatedSubscriptions.length ?? 0} users`
  );
}

let allTasks: schedule.Job[] = [];

export function startCronTasks() {
  const updateSubscriptionStatusTask = schedule.scheduleJob(
    "checkSubscriptions",
    "0 0 0 * * *",
    checkUsers
  );

  const allTasks = [updateSubscriptionStatusTask];

  allTasks.forEach((t) =>
    console.log(`task ${t.name} will be executed at ${t.nextInvocation()}`)
  );
}

export function stopCronTasks() {
  allTasks.forEach((t) => {
    t.cancel();
  });
}
