import { Router, Mutation, Query } from 'nestjs-trpc';

@Router({ alias: 'verification' })
export class VerificationRouter {
  @Mutation({})
  async registerVerificationTicket() {}

  @Mutation({})
  async acceptVerificationTicket() {}

  @Mutation({})
  async rejectVerificationTicket() {}

  @Query({})
  async getVerificationTickets() {}

  @Query({})
  async getApprovedTickets() {}

  @Query({})
  async getRejectedTickets() {}
}
