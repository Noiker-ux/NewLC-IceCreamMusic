import { Inject, Injectable } from '@nestjs/common';
import { genSalt, hash } from 'bcrypt-ts';
import { schema, type DB } from 'db';
import { and, eq, gte, InferEnum } from 'drizzle-orm';
import { SessionService } from './session.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject('DB_TAG') private readonly db: DB,
    private readonly sessionService: SessionService,
  ) {}

  async hashPassword(password: string) {
    const passwordSalt = await genSalt(Number(process.env.SALT_ROUNDS!));

    const hashedPassword = await hash(password, passwordSalt);

    return hashedPassword;
  }

  async registerEmailToken(
    userId: string,
    type: InferEnum<typeof schema.verificationTokenTypes>,
  ) {
    return (
      await this.db
        .insert(schema.verificationTokens)
        .values({
          expires: new Date(new Date().getTime() + 60 * 60 * 24 * 1000),
          token: this.sessionService.generateToken(),
          userId,
          type,
        })
        .returning()
    )[0];
  }

  async applyEmailToken(
    token: string,
    type: InferEnum<typeof schema.verificationTokenTypes>,
  ) {
    return await this.db.transaction(async (tx) => {
      const verificationToken = await tx.query.verificationTokens.findFirst({
        where: and(
          eq(schema.verificationTokens.token, token),
          gte(schema.verificationTokens.expires, new Date()),
          eq(schema.verificationTokens.type, type),
        ),
        with: { user: true },
      });

      await tx
        .delete(schema.verificationTokens)
        .where(eq(schema.verificationTokens.token, token));

      return verificationToken;
    });
  }
}
