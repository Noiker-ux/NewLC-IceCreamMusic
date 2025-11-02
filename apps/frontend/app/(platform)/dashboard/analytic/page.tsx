import { actionGetAnalyticMe } from '@/components/Analytic/actionGetAnalyticMe';
import CardAnalytic from '@/components/Analytic/CardAnalytic/CardAnalytic';
import { sessionCookieName } from '@/shared/lib/config/auth';
import { createSDKConnection } from '@/shared/lib/config/sdk';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { functional } from 'sdk';

export const metadata: Metadata = {
	title: 'ICECREAMMUSIC | Аналитика',
	description:
		'ICECREAMMUSIC - Управляйте своим творчеством, продажами и маркетингом в одном месте, чтобы сделать вашу музыку заметной и доступной миллионам слушателей!',
};

export const dynamic = 'force-dynamic';

export default async function AnalyticPage() {
	const myAnalytics = await actionGetAnalyticMe();

	const cookiesStore = await cookies();
	const sessionToken = await cookiesStore.get(sessionCookieName)?.value;
	if (!sessionToken) redirect('/auth/signin');
	const authHeaders = new Headers();
	authHeaders.set('Authorization', sessionToken);
	const connection = await createSDKConnection({
		headers: authHeaders,
		next: { tags: ['my-analytic'], revalidate: 5 },
	});
	const session = await functional.api.v1.auth
		.checkSessionToken(connection)
		.catch(() => null);

	const adminkey = session?.user.isAdmin;
	return (
		<div className='flex flex-col gap-5 max-w-7xl'>
			{myAnalytics.success &&
				myAnalytics.data.data.map((analytic) => (
					<div key={analytic.id}>
						<CardAnalytic analytic={analytic} adminkey={adminkey} />
					</div>
				))}
		</div>
	);
}
