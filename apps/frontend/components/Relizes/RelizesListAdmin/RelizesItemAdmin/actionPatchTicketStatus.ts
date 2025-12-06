'use server';
import ReleaseReject from '@/emails/RelizesMessages/ReleaseReject';
import ReleaseSuccess from '@/emails/RelizesMessages/ReleaseSuccess';
import { sessionCookieName } from '@/shared/lib/config/auth';
import { createSDKConnection } from '@/shared/lib/config/sdk';
import { createSMTPClient } from '@/utils/createSMTPClient';
import { render } from '@react-email/render';
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
		const res = await functional.api.v1.releases.moderation
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

		if (res.success) {
			const transport = await createSMTPClient().catch(() => null);

			if (!transport) {
				return {
					success: false as const,
					error: 'Ошибка отправки письма',
				};
			}

			const emailHTML = await render(
				ReleaseReject({ rejectReason: reason, title: res.data.title }),
			);

			transport.sendMail({
				from: 'info@icecreammusic.net',
				to: res.data.email,
				html: emailHTML,
				subject: 'Изменение статуса релиза',
			});
		}
	}

	if (!!upc && status === 'approved') {
		const res = await functional.api.v1.releases.moderation
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

		if (res.success) {
			const transport = await createSMTPClient().catch(() => null);

			if (!transport) {
				return {
					success: false as const,
					error: 'Ошибка отправки письма',
				};
			}

			const emailHTML = await render(ReleaseSuccess({ title: res.data.title }));

			transport.sendMail({
				from: 'info@icecreammusic.net',
				to: res.data.email,
				html: emailHTML,
				subject: 'Изменение статуса релиза',
			});
		}
	}

	return {
		success: true as const,
		message: 'Статус релиза изменен',
	};
}
