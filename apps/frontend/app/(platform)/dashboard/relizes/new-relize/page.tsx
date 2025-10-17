import NewRelizeForm from '@/components/NewRelize/NewRelizeForm';
import { checkUserVerified } from '../../account/verification/checkUserVerified';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'ICECREAMMUSIC | Новый релиз',
	description:
		'ICECREAMMUSIC - Управляйте своим творчеством, продажами и маркетингом в одном месте, чтобы сделать вашу музыку заметной и доступной миллионам слушателей!',
};

export default async function NewRelizePage() {
	const verificationResult = await checkUserVerified();

	if (!verificationResult.success) redirect('/dashboard/account/verification');

	return (
		<div className='max-w-7xl'>
			<p className='text-3xl font-extrabold mb-5'>Новый релиз</p>
			<NewRelizeForm />
		</div>
	);
}
