import { Mutation, Query, Router } from 'nestjs-trpc';

@Router({ alias: 'faq' })
export class FAQRouter {
  @Query({})
  async getFAQ() {}

  @Mutation({})
  async addFAQ() {}

  @Mutation({})
  async updateFAQ() {}

  @Mutation({})
  async deleteFAQ() {}
}
