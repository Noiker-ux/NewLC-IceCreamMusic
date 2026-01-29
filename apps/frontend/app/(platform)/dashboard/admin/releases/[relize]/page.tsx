import RelizeDetail from '@/components/Relizes/RelizeDetail';
import { checkUserAdmin } from '../../checkUserAdmin';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'ICECREAMMUSIC | Админ панель Релизы',
	description:
		'ICECREAMMUSIC - Управляйте своим творчеством, продажами и маркетингом в одном месте, чтобы сделать вашу музыку заметной и доступной миллионам слушателей!',
};

export const dynamic = 'force-dynamic';

export default async function DetailRelizePage({
	params,
}: {
	params: Promise<{ relize: string }>;
}) {
	await checkUserAdmin();

	const { relize } = await params;
	return (
		<>
			<RelizeDetail relizeID={relize} />
		</>
	);
}
