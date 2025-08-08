'use server';
import { sessionCookieName } from '@/shared/lib/config/auth';
import { createSDKConnection } from '@/shared/lib/config/sdk';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { functional } from 'sdk';
import { TRelease } from 'shared/schema/release.schema';

const statuses: TRelease['status'][] = ['approved', 'moderating', 'rejected'];

export default async function actionGetRelizes(status: TRelease['status'] = 'moderating') {
	let validStatus: TRelease['status'] = 'moderating';

	const isStatusValid = statuses.includes(status);

	if(isStatusValid){
		validStatus = status;
	}

	const cookiesStore = await cookies();

	const sessionToken = await cookiesStore.get(sessionCookieName)?.value;

	if (!sessionToken) redirect('/auth/signin');

	const authHeaders = new Headers();

	authHeaders.set('Authorization', sessionToken);

	const connection = await createSDKConnection({
		headers: authHeaders,
		next: { tags: ['admin-releases'], revalidate: 5 },
	});

	const releasesData = await functional.v1.releases.status.getReleases(connection, validStatus, {
		page: 1,
		size: 500,
	});

	return releasesData;
}
