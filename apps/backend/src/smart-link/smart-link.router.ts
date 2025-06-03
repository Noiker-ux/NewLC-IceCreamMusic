import { Mutation, Query, Router } from 'nestjs-trpc';

@Router({ alias: 'smartlink' })
export class SmartLinkRouter {
  @Query({})
  async getSmartLinkById() {}

  @Query({})
  async createSmartLink() {}

  @Mutation({})
  async deleteSmartLink() {}

  @Mutation({})
  async updateSmartLink() {}
}
