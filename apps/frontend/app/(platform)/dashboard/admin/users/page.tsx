import { sessionCookieName } from '@/shared/lib/config/auth';
import { createSDKConnection } from '@/shared/lib/config/sdk';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { functional } from 'sdk';
import Link from 'next/link';
import { Button } from '@heroui/button';
import Image from 'next/image';
import { checkUserAdmin } from '../checkUserAdmin';
import Balance from '@/components/Balance/Balance';
import MoneyFormatter from '@/utils/moneyFormatter';

import { ChartBarIcon } from '@heroicons/react/24/outline';

export default async function UsersPage() {
	await checkUserAdmin();

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
			size: 1000,
		})
		.then((r) => ({ success: true as const, data: r.data }))
		.catch((e) => ({ success: false as const, error: e.message }));

	if (!result.success) return <>not found</>;

	return (
		<div className='z-[100000] flex flex-col gap-5 max-w-7xl '>
			{result.data.map((u) => {
				const isExternalAvatar = u.avatar
					? u.avatar.includes('https://')
					: false;

				const avatarUrl = isExternalAvatar
					? `${u.avatar}`
					: `${process.env.NEXT_PUBLIC_S3_URL}/avatars/${u.id}.${u.avatar}`;

				return (
					<div key={u.id} className='bg-zinc-900 p-5'>
						<div className='flex gap-5'>
							<Image
								src={u.avatar ? avatarUrl : '/assets/noUserAvatar.png'}
								width={100}
								height={100}
								alt='Превью'
								className='rounded-full w-[100px] h-[100px] object-cover'
							/>
							<div>
								<p>
									{u.name} -{' '}
									{u.subscriptionLevel ?? (
										<span className='text-red-800'>Подписка не активна</span>
									)}
								</p>
								<p>{u.email}</p>
								<p>
									Баланс пользователя:{' '}
									{MoneyFormatter(Number(u.balance.toFixed(2)))}
								</p>
								<div className='flex gap-5 items-center mt-5'>
									<Button
										as={Link}
										href={`/dashboard/admin/users/${u.id}/relizes`}>
										Релизы пользователя
									</Button>
									<Balance userId={u.id} />
									{/* <Button
										as={Link}
										href={`/dashboard/admin/users/${u.id}/analytic`}>
										<ChartBarIcon />
									</Button> */}
								</div>
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
}
