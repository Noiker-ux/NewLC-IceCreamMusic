import cron from "node-cron";

const checkSubscriptionTask = cron.schedule("0 0 0 * * *", async () => {
  console.log("checking subscriptions");
});

const allTasks = [checkSubscriptionTask];

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
