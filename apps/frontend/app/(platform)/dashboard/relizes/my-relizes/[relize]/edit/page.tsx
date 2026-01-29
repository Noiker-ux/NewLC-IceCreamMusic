import NewRelizeForm from '@/components/NewRelize/NewRelizeForm';
import { actionGetRelizeById } from '@/components/Relizes/actionGetRelizeById';

export const dynamic = 'force-dynamic';

export default async function EditReleasePage({
	params,
}: {
	params: Promise<{ relize: string }>;
}) {
	const { relize } = await params;
	const { data } = await actionGetRelizeById(relize);

	const releaseDate = new Date(data.releaseDate);

	const startDate = new Date(data.startDate);

	const preorderDate = new Date(data.preorderDate);

	const yandexSoonNewRelease = data.yandexSoonNewRelease
		? new Date(data.yandexSoonNewRelease)
		: null;

	const { tracks } = data;

	return (
		<NewRelizeForm
			release={{
				...data,
				releaseDate,
				startDate,
				preorderDate,
				yandexSoonNewRelease,
				tracks: tracks.map((track) => ({
					...track,
					instant_gratification: track.instant_gratification
						? new Date(track.instant_gratification)
						: null,
				})),
			}}
		/>
	);
}
