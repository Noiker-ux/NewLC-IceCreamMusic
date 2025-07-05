import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as schema from 'db/schema';
import { inArray } from 'drizzle-orm';
import { lte } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { checkout } from 'shared/config/aquiring';
import { TSubscriptionMetadata } from 'shared/schema/order.schema';
import { calculateSubscriptionEstimate } from 'shared/helpers/calculateServices';
import { premiumPlans } from 'shared/helpers/premiumPlans';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(
    @Inject('DB_TAG') private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async invalidateSubscripttion() {
    this.logger.log('updating subscriptions');

    const currentMoment = new Date();

    const usersWithSubscriptionExpired = await this.db.query.users.findMany({
      with: {
        payment_methods: true,
      },
      where: lte(schema.users.subscriptionExpires, currentMoment),
    });

    if (usersWithSubscriptionExpired.length === 0) {
      this.logger.log('no match users');
      return;
    }

    const expiredUserIds: string[] = [];

    for (let user of usersWithSubscriptionExpired) {
      if (!user.subscriptionLevel) continue;

      const paymentMethod = user.payment_methods.find((m) => m.isDefault);

      if (!paymentMethod) {
        expiredUserIds.push(user.id);
        continue;
      }

      const payment = await checkout
        .createPayment({
          amount: {
            value: premiumPlans[user.subscriptionLevel].price.toFixed(2),
            currency: 'RUB',
          },
          receipt: {
            items: await calculateSubscriptionEstimate(user.subscriptionLevel),
            tax_system_code: 1,
            customer: {
              email: user.email,
            },
          },

          payment_method_id: paymentMethod.id,

          description: `Оплата подписки уровня ${premiumPlans[user.subscriptionLevel].name}`,
        })
        .catch((e) => {
          this.logger.error(e);
          return null;
        });

      if (payment) {
        await this.db.insert(schema.orders).values({
          id: payment.id,
          type: 'subscription',
          userId: user.id,
          metadata: {
            subscriptionLevel: user.subscriptionLevel,
          } as TSubscriptionMetadata,
        });
      }
    }

    const updatedSubscriptions = await this.db
      .update(schema.users)
      .set({ isSubscribed: false, freeReleases: 0 })
      .where(inArray(schema.users.id, expiredUserIds))
      .returning({ id: schema.users.id });

    this.logger.log(
      `updated subscription status for ${updatedSubscriptions.length ?? 0} users`,
    );
  }
}
