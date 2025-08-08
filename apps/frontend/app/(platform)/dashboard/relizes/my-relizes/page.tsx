import RelizesList from '@/components/Relizes/RelizesList';
import { checkUserVerified } from '../../account/verification/checkUserVerified';
import { redirect } from 'next/navigation';

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
