'use server';

import { cookies } from 'next/headers';
import {
	invalidateSession,
	SessionValidationResult,
	validateSessionToken,
} from '@/features/auth/lib/session';
import { redirect } from 'next/navigation';

export async function auth(): Promise<SessionValidationResult> {
	const cookieStore = await cookies();

	const sessionToken = cookieStore.get('example-session')?.value;

	if (!sessionToken) {
		return { session: null, user: null };
	}

	return await validateSessionToken(sessionToken);
}

export async function signOut() {
	const cookieStore = await cookies();

	const sessionToken = cookieStore.get('example-session')?.value;

	if (!sessionToken) return;

	await invalidateSession(sessionToken);

	cookieStore.delete('example-session');
}

export async function signIn(provider: string, params: string) {
	redirect(`/api/auth/signin/${provider}?${params}`);
}
