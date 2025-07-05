import { Mutation, Query, Router } from 'nestjs-trpc';

@Router({ alias: 'finance' })
export class FinanceRouter {
  @Mutation({})
  async makeOrder() {}

  @Mutation({})
  async confirmOrder() {}

  @Query({})
  async getOrderById() {}
}
