import RelizeDetail from '@/components/Relizes/RelizeDetail';

export const dynamic = 'force-dynamic';

export default async function DetailRelizePage({
	params,
}: {
	params: Promise<{ relize: string }>;
}) {
	const { relize } = await params;
	return (
		<>
			<RelizeDetail relizeID={relize} />
		</>
	);
}
