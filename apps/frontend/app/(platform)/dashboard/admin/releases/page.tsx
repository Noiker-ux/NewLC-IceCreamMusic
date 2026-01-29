import actionGetRelizes from '@/components/Relizes/RelizesListAdmin/actionGetRelizes';
import RelizesListAdmin from '@/components/Relizes/RelizesListAdmin/RelizesListAdmin';
import { TRelease } from 'shared/schema/release.schema';
import { checkUserAdmin } from '../checkUserAdmin';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'ICECREAMMUSIC | Админ панель Релизы',
	description:
		'ICECREAMMUSIC - Управляйте своим творчеством, продажами и маркетингом в одном месте, чтобы сделать вашу музыку заметной и доступной миллионам слушателей!',
};

export const dynamic = 'force-dynamic';

export default async function RealeasesAdminPage({
	searchParams,
}: {
	searchParams: Promise<{ status?: TRelease['status'] }>;
}) {
	await checkUserAdmin();

	const { status } = await searchParams;

	const { data } = await actionGetRelizes(status);

	return (
		<div className='flex flex-col gap-4'>
			<h1 className='text-2xl font-bold'>Realeases Admin Page</h1>
			<RelizesListAdmin releases={data} />
		</div>
	);
}
