import RelizeDetail from '@/components/Relizes/RelizeDetail';
import { checkUserVerified } from '../../../account/verification/checkUserVerified';
import { redirect } from 'next/navigation';

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
