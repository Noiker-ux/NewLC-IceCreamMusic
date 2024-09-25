import { db } from "../db";
import { users } from "../db/schema";
import { gt } from "drizzle-orm";
import cron from "node-cron";

const updateSubscriptionStatusTask = cron.schedule("0 0 0 * * *", async () => {
  console.log("updating subscriptions");

  const currentMoment = new Date();
  const updatedSubscriptions = await db
    .update(users)
    .set({ isSubscribed: false })
    .where(gt(users.subscriptionExpires, currentMoment))
    .returning({ id: users.id });

  console.log(
    `updated subscription status for ${updatedSubscriptions.length} users`
  );
});

const allTasks = [updateSubscriptionStatusTask];

export function startCronTasks() {
  allTasks.forEach((t) => {
    t.start();
  });
}

export function stopCronTasks() {
  allTasks.forEach((t) => {
    t.stop();
  });
}
