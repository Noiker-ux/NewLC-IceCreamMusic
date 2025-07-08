import StudioDetail from '@/components/Studios/StudiosDetail/StudioDetail';
import { createSDKConnection } from '@/shared/lib/config/sdk';
import { functional } from 'sdk';

export const dynamic = 'force-dynamic';

const connection = createSDKConnection({
	next: {
		tags: ['Studia'],
	},
});

export default async function StudiosPage({
	params,
}: {
	params: Promise<{ studia: string }>;
}) {
	const studioDetail = await functional.v1.studios.getStudioById(
		connection,
		(await params).studia,
	);

	return (
		<div>
			<StudioDetail studio={studioDetail} />
		</div>
	);
}
