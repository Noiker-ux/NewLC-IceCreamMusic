import { Inject, Injectable, Logger } from '@nestjs/common';
import { type DB, schema } from 'db';
import { encodeBase32NoPadding, encodeHexLowerCase } from '@oslojs/encoding';
import { sha256 } from '@oslojs/crypto/sha2';
import { eq, InferInsertModel, InferSelectModel } from 'drizzle-orm';

export type TUser = InferSelectModel<typeof schema.users>;

export type TSession = InferInsertModel<typeof schema.sessions>;

type SessionValidationResult =
  | { session: TSession; user: TUser }
  | { session: null; user: null };

const sessionTable = schema.sessions;

const userTable = schema.users;

const emptySession = {
  session: null,
  user: null,
} as const;

@Injectable()
export class SessionService {
  logger = new Logger(SessionService.name);
  constructor(@Inject('DB_TAG') private readonly db: DB) {}

  generateToken(): string {
    const bytes = new Uint8Array(20);
    crypto.getRandomValues(bytes);
    const token = encodeBase32NoPadding(bytes).toLowerCase();
    return token;
  }

  createSession(token: string, userId: string): TSession {
    const sessionId = encodeHexLowerCase(
      sha256(new TextEncoder().encode(token)),
    );
    const session: TSession = {
      sessionToken: sessionId,
      userId,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    };

    return session;
  }

  async validateSession(token: string): Promise<SessionValidationResult> {
    const result = await this.db
      .select({ user: userTable, session: sessionTable })
      .from(sessionTable)
      .innerJoin(schema.users, eq(sessionTable.userId, userTable.id))
      .where(eq(sessionTable.sessionToken, token))
      .limit(1)
      .then((res) => res.at(0));

    if (!result) {
      return emptySession;
    }

    const { session } = result;

    const currentMoment = Date.now();

    if (currentMoment >= session.expires.getTime()) {
      await this.invalidateSession(session.sessionToken);
      return emptySession;
    }

    return result;
  }

  async invalidateSession(sessionId: string): Promise<void> {
    await this.db
      .delete(sessionTable)
      .where(eq(sessionTable.sessionToken, sessionId));
  }

  async invalidateAllSessions(userId: string): Promise<void> {
    await this.db.delete(sessionTable).where(eq(sessionTable.userId, userId));
  }

  async registerSession(userId: string) {
    const sessionToken = this.generateToken();

    const session = this.createSession(sessionToken, userId);

    await this.db.insert(schema.sessions).values(session);

    return session;
  }
}
