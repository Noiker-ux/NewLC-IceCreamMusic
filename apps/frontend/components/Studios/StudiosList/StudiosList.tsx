import { createSDKConnection } from '@/shared/lib/config/sdk';
import StudiosCard from '../StudiosCard/StudiosCard';
import { functional } from 'sdk';
import Link from 'next/link';

const connection = createSDKConnection({
	next: { tags: ['Studios'] },
});

export default async function StudiosList() {
	const studioData = await functional.v1.studios.getStudios(connection, {
		page: 1,
		size: 1000,
	});

	return (
		<div className='grid grid-cols-5 gap-2'>
			{studioData.map((studia) => (
				<Link href={`/studios/${studia.id}`} key={studia.id}>
					<StudiosCard
						name={studia.name}
						preview={`${process.env.NEXT_PUBLIC_S3_URL}/studios/${studia.id}.${studia.logo}`}
						rating={studia.rating}
						place={studia.address}
					/>
				</Link>
			))}
		</div>
	);
}
