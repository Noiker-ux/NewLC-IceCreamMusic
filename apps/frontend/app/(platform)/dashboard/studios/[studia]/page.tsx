import StudioDetail from '@/components/Studios/StudiosDetail/StudioDetail';
import { createSDKConnection } from '@/shared/lib/config/sdk';
import { Metadata } from 'next';
import { functional } from 'sdk';

export const metadata: Metadata = {
	title: 'ICECREAMMUSIC | Студии звукозаписи',
	description:
		'ICECREAMMUSIC - Управляйте своим творчеством, продажами и маркетингом в одном месте, чтобы сделать вашу музыку заметной и доступной миллионам слушателей!',
};

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
	const studioDetail = await functional.api.v1.studios.getStudioById(
		connection,
		(await params).studia,
	);

	return (
		<div>
			<StudioDetail studio={studioDetail} />
		</div>
	);
}
