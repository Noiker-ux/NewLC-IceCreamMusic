'use server';
import { sessionCookieName } from '@/shared/lib/config/auth';
import { createSDKConnection } from '@/shared/lib/config/sdk';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { functional } from 'sdk';

export default async function actionPatchTicketStatus(
	releaseId: string,
	status: 'moderating' | 'approved' | 'rejected',
	reason?: string,
	upc?: string,
) {
	const cookiesStore = await cookies();

	const sessionToken = await cookiesStore.get(sessionCookieName)?.value;

	if (!sessionToken) redirect('/auth/signin');

	const authHeaders = new Headers();

	authHeaders.set('Authorization', sessionToken);

	const connection = await createSDKConnection({
		headers: authHeaders,
		next: { tags: ['admin-releases'], revalidate: 5 },
	});

	if (!!reason && status === 'rejected') {
		await functional.v1.releases.moderation
			.updateReleaseModerationStatus(connection, releaseId, {
				status,
				rejectReason: reason,
			})
			.catch((e) => {
				return {
					success: false as const,
					message: e.message,
				};
			});
	}

	if (!!upc && status === 'approved') {
		await functional.v1.releases.moderation
			.updateReleaseModerationStatus(connection, releaseId, {
				status: status,
				upc: upc,
			})
			.catch((e) => {
				return {
					success: false as const,
					message: e.message,
				};
			});
	}

	return {
		success: true as const,
		message: 'Статус релиза изменен',
	};
}
