import { Mutation, Query, Router } from 'nestjs-trpc';

@Router({ alias: 'news' })
export class NewsRouter {
  @Query({})
  async getNews() {}

  @Query({})
  async getNewsDAta() {}

  @Mutation({})
  async updateNews() {}

  @Mutation({})
  async addNews() {}

  @Mutation({})
  async deleteNews() {}
}
