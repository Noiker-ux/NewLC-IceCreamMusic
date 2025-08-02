'use server';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export async function actionLogOut() {
	const cookie = await cookies();
	cookie.delete('icecream-auth');
	redirect('/auth/signin');
}
