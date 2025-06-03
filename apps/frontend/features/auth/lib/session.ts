import { db } from 'db';
import * as schema from 'db/schema';
import { eq, InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { encodeBase32NoPadding, encodeHexLowerCase } from '@oslojs/encoding';
import { sha256 } from '@oslojs/crypto/sha2';

type User = InferSelectModel<typeof schema.users>;

type Session = InferInsertModel<typeof schema.sessions>;

export type SessionValidationResult =
	| { session: Session; user: User }
	| { session: null; user: null };

const sessionTable = schema.sessions;

const userTable = schema.users;

export function generateToken(): string {
	const bytes = new Uint8Array(20);
	crypto.getRandomValues(bytes);
	const token = encodeBase32NoPadding(bytes).toLowerCase();
	return token;
}

export async function createSession(
	token: string,
	userId: string,
): Promise<Session> {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const session: Session = {
		sessionToken: sessionId,
		userId,
		expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
	};
	return session;
}

export async function validateSessionToken(
	token: string,
): Promise<SessionValidationResult> {
	const result = await db
		.select({ user: userTable, session: sessionTable })
		.from(sessionTable)
		.innerJoin(userTable, eq(sessionTable.userId, userTable.id))
		.where(eq(sessionTable.sessionToken, token))
		.limit(1)
		.then((res) => res.at(0));

	if (!result) {
		return { session: null, user: null };
	}

	const { user, session } = result;

	if (Date.now() >= session.expires.getTime()) {
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
