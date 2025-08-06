import { sessionCookieName } from '@/shared/lib/config/auth';
import { createSDKConnection } from '@/shared/lib/config/sdk';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { functional } from 'sdk';
import Link from 'next/link';
import { Button } from '@heroui/button';
import Image from 'next/image';

export default async function UsersPage() {
	const cookiesStore = await cookies();

	const sessionToken = await cookiesStore.get(sessionCookieName)?.value;

	if (!sessionToken) redirect('/auth/signin');

	const authHeaders = new Headers();

	authHeaders.set('Authorization', sessionToken);

	const connection = await createSDKConnection({
		headers: authHeaders,
		next: { tags: ['admin-users'], revalidate: 5 },
	});

	const result = await functional.v1.users
		.getUsers(connection, {
			page: 1,
			size: 10,
		})
		.then((r) => ({ success: true as const, data: r.data }))
		.catch((e) => ({ success: false as const, error: e.message }));

	if (!result.success) return <>not found</>;

	return (
		<div className='z-[100000] flex flex-col gap-5 max-w-7xl '>
			{result.data.map((u) => {
				return (
					<div key={u.id} className='bg-zinc-900 p-5'>
						<div className='flex gap-5'>
							<Image
								src={u.avatar ?? '/assets/noUserAvatar.png'}
								width={100}
								height={100}
								alt='Превью'
								className='rounded-full'
							/>
							<div>
								<p>
									{u.name} -{' '}
									{u.subscriptionLevel ?? (
										<span className='text-red-800'>Подписка не активна</span>
									)}
								</p>
								<p>{u.email}</p>
								<Button
									as={Link}
									className='mt-5'
									href={`/dashboard/admin/users/${u.id}/relizes`}>
									Релизы пользователя
								</Button>
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
}
