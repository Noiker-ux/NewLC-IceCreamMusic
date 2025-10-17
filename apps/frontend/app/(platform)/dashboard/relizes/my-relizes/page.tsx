import RelizesList from '@/components/Relizes/RelizesList';
import { checkUserVerified } from '../../account/verification/checkUserVerified';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'ICECREAMMUSIC | Мои релизы',
	description:
		'ICECREAMMUSIC - Управляйте своим творчеством, продажами и маркетингом в одном месте, чтобы сделать вашу музыку заметной и доступной миллионам слушателей!',
};

export const dynamic = 'force-dynamic';

export default async function MyRelizesPage() {
	const verificationResult = await checkUserVerified();

	if (!verificationResult.success) redirect('/dashboard/account/verification');
	return (
		<div className='flex flex-col gap-5 max-w-7xl'>
			<RelizesList />
		</div>
	);
}
