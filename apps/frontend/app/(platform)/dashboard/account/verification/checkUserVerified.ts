'use server'

import { sessionCookieName } from '@/shared/lib/config/auth';
import { createSDKConnection } from '@/shared/lib/config/sdk';
import { cookies } from 'next/headers';
import { functional } from 'sdk';

export async function checkUserVerified() {
  const cookieStore = await cookies();

  const sessionToken = cookieStore.get(sessionCookieName)?.value;

  const authHeaders = new Headers();

  authHeaders.set('Authorization', `${sessionToken}`);

  const connecttion = createSDKConnection({
			headers: authHeaders,
			next: {
				tags: ['user-verification'],
			},
		});

  const userResult = await functional.api.v1.users.me.getMyInfo(connecttion).catch(()=>null);

  if(userResult?.data.isVerifiedAuthor) {
    return {
      success: true as const,
    }
  }

  return {
    success: false as const
  }
}