import NewRelizeForm from '@/components/NewRelize/NewRelizeForm';
import { checkUserVerified } from '../../account/verification/checkUserVerified';
import { redirect } from 'next/navigation';

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
