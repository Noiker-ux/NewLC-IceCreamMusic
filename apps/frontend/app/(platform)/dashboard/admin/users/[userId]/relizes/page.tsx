import RelizecCard from '@/components/Relizes/RelizesCard';
import { sessionCookieName } from '@/shared/lib/config/auth';
import { createSDKConnection } from '@/shared/lib/config/sdk';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { functional } from 'sdk';

export const metadata: Metadata = {
	title: 'ICECREAMMUSIC | Админ панель Релизы пользователя',
	description:
		'ICECREAMMUSIC - Управляйте своим творчеством, продажами и маркетингом в одном месте, чтобы сделать вашу музыку заметной и доступной миллионам слушателей!',
};

export default async function AdminRelizesPage({
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
		next: { tags: ['admin-releases'], revalidate: 5 },
	});

	const usersResult = await functional.api.v1.releases.user
		.getUserReleases(connection, userId, {
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

	if (!usersResult.success) return <>Not found</>;

	return (
		<div className='max-w-7xl'>
			{usersResult.data.map((r) => {
				return <RelizecCard key={r.id} release={r} />;
			})}
		</div>
	);
}
