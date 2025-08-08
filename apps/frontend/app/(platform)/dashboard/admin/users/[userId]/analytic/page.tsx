import FormAnalytic from '@/components/Analytic/FormAnalytic/FormAnalytic';
import CardAnalytic from '@/components/Analytic/CardAnalytic/CardAnalytic';
import { sessionCookieName } from '@/shared/lib/config/auth';
import { createSDKConnection } from '@/shared/lib/config/sdk';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { functional } from 'sdk';
import { PlusIcon } from '@heroicons/react/24/outline';
export default async function AdminAnalyticPage({
	params,
}: {
	params: Promise<{ userId: string }>;
}) {
	const { userId } = await params;

	const cookiesStore = await cookies();

	const sessionToken = await cookiesStore.get(sessionCookieName)?.value;

	if (!sessionToken) redirect('/auth/signin');

	const authHeaders = new Headers();

	authHeaders.set('Authorization', sessionToken);

	const connection = await createSDKConnection({
		headers: authHeaders,
		next: { tags: ['admin-analytic'], revalidate: 5 },
	});

	const analyticResult = await functional.v1.analytics.user
		.getUserAnalytics(connection, userId, {
			page: 1,
			size: 1000,
		})
		.then((r) => ({
			success: true as const,
			data: r.data,
		}))
		.catch((e) => ({
			success: false as const,
			error: e.message,
		}));

	if (!analyticResult.success) return <>Not found</>;

	return (
		<>
			<FormAnalytic userId={userId}>
				<PlusIcon />
			</FormAnalytic>
			<div className='max-w-7xl flex flex-col gap-5 mt-5'>
				{analyticResult.data.map((a) => (
					<div key={a.id}>
						<CardAnalytic analytic={a} />
					</div>
				))}
			</div>
		</>
	);
}
