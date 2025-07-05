import { createHash, getRandomValues } from "crypto";
import { db } from "db";
import * as schema from "db/schema";
import { eq, InferInsertModel, InferSelectModel } from "drizzle-orm";
type User = InferSelectModel<typeof schema.users>;

type Session = InferInsertModel<typeof schema.sessions>;

export type SessionValidationResult =
  | { session: Session; user: User }
  | { session: null; user: null };

const sessionTable = schema.sessions;

const userTable = schema.users;

export function generateToken(): string {
  const bytes = new Uint8Array(20);
  getRandomValues(bytes);
  const token = Buffer.from(bytes).toString("base64").toLowerCase();
  return token;
}

export async function createSession(
  token: string,
  userId: string
): Promise<Session> {
  const sessionId = createHash("sha256")
    .update(token)
    .digest("hex")
    .toLowerCase();
  const session: Session = {
    sessionToken: sessionId,
    userId,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
  };
  return session;
}

export async function validateSessionToken(
  token: string
): Promise<SessionValidationResult> {
  const session = await db.query.sessions.findFirst({
    where: eq(sessionTable.sessionToken, token),
    with: { user: true },
  });

  if (!session) {
    return { session: null, user: null };
  }

  const { user, ...sessionData } = session;

  if (Date.now() >= sessionData.expires.getTime()) {
    await db
      .delete(sessionTable)
      .where(eq(sessionTable.sessionToken, session.sessionToken));
    return { session: null, user: null };
  }

  if (Date.now() >= session.expires.getTime() - 1000 * 60 * 60 * 24 * 15) {
    session.expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
    await db
      .update(sessionTable)
      .set({
        expires: session.expires,
      })
      .where(eq(sessionTable.sessionToken, session.sessionToken));
  }

  return { session, user };
}

export async function invalidateSession(sessionId: string): Promise<void> {
  await db.delete(sessionTable).where(eq(sessionTable.sessionToken, sessionId));
}

export async function invalidateAllSessions(userId: string): Promise<void> {
  await db.delete(sessionTable).where(eq(sessionTable.userId, userId));
}

export async function registerSession(userId: string) {
  const sessionToken = await generateToken();

  const session = await createSession(sessionToken, userId);

  await db.insert(schema.sessions).values(session);

  return session;
}
