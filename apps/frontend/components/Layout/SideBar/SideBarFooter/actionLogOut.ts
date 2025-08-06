'use server';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { sessionCookieName } from '@/shared/lib/config/auth';

export async function actionLogOut() {
	const cookie = await cookies();
	cookie.delete(sessionCookieName);
	redirect('/auth/signin');
}
