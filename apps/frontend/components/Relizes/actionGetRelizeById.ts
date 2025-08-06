'use server';
import { createSDKConnection } from '@/shared/lib/config/sdk';
import { functional } from 'sdk';

import { cookies } from 'next/headers';
import { sessionCookieName } from '@/shared/lib/config/auth';

export async function actionGetRelizeById(releaseId: string) {
	const cookieStore = await cookies();
	const token = cookieStore.get(sessionCookieName)?.value;

	const headers = new Headers();
	headers.set('Authorization', `${token}`);
	const connection = createSDKConnection({
		headers,
	});

	const res = await functional.v1.releases.getReleaseById(
		connection,
		releaseId,
	);

	return res;
}
