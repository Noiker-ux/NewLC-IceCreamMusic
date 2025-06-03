import { Mutation, Query, Router } from 'nestjs-trpc';

@Router({ alias: 'release' })
export class ReleaseRouter {
  @Mutation({})
  async approveRelease() {}

  @Mutation({})
  async rejectRelease() {}

  @Query({})
  async getReleaseById() {}

  @Query({})
  async getUserReleases() {}
}
