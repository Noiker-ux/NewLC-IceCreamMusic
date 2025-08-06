import RelizeDetail from '@/components/Relizes/RelizeDetail';
import { checkUserAdmin } from '../../checkUserAdmin';

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
