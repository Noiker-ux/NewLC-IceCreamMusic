'use server'

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createSDKConnection } from '@/shared/lib/config/sdk';
import { functional } from 'sdk';
import { sessionCookieName } from '@/shared/lib/config/auth';

export async function checkUserAdmin() {
  const cookieStore = await cookies();

  const sessionToken = cookieStore.get(sessionCookieName)?.value;

  if(!sessionToken) redirect('/auth/signin');

  const authHeaders = new Headers();

  authHeaders.set('Authorization', sessionToken);

  const connecttion = createSDKConnection({
			headers: authHeaders,
			next: {
				tags: ['authorization'],
			},
		});

  const checkTokenResult = await functional.api.v1.auth
			.checkSessionToken(connecttion)
			.catch(() => ({
				user: null,
			}));

  if(!checkTokenResult.user?.isAdmin) redirect('/dashboard/main/news')
}