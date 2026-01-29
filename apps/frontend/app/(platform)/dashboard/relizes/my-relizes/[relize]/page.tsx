import RelizeDetail from '@/components/Relizes/RelizeDetail';
import { checkUserVerified } from '../../../account/verification/checkUserVerified';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'ICECREAMMUSIC | Мой релиз',
	description:
		'ICECREAMMUSIC - Управляйте своим творчеством, продажами и маркетингом в одном месте, чтобы сделать вашу музыку заметной и доступной миллионам слушателей!',
};

export const dynamic = 'force-dynamic';

export default async function DetailRelizePage({
	params,
}: {
	params: Promise<{ relize: string }>;
}) {
	const verificationResult = await checkUserVerified();

	if (!verificationResult.success) redirect('/dashboard/account/verification');

	const { relize } = await params;
	return (
		<>
			<RelizeDetail relizeID={relize} />
		</>
	);
}
