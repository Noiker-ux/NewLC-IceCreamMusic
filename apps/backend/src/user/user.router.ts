import { Mutation, Query, Router } from 'nestjs-trpc';

@Router({ alias: 'user' })
export class UserRouter {
  @Query({})
  async getUserByVerificationTicket() {}

  @Query({})
  async getUserByRelease() {}

  @Query({})
  async getUserById() {}

  @Mutation({})
  async updateUser() {}

  @Mutation({})
  async deleteUser() {}

  @Mutation({})
  async registerUser() {}
}
