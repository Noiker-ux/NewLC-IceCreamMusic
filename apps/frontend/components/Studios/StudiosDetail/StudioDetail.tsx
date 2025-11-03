import { cn } from '@/utils/cn';
import { TCompleteStudioData } from 'sdk/lib/studio/studio.controller';
import StudioAbout from './StudioAbout/StudioAbout';
import StudioPhotos from './StudioPhoto/StudioPhotos';
import StudiosPreview from './StudiosPreview/StudiosPreview';
import StudiosTeam from './StudiosTeam/StudiosTeam';
import YMap from './StudioMap/StudioMap';
import Link from 'next/link';
import { TStudioData } from 'shared/schema/studio.schema';
export default function StudioDetail({ studio }: { studio: TStudioData }) {
	return (
		<>
			<StudiosPreview
				bgImage={`${process.env.NEXT_PUBLIC_S3_URL}/studio-backgrounds/${studio.id}.${studio.background}`}
				logo={`${process.env.NEXT_PUBLIC_S3_URL}/studios/${studio.id}.${studio.logo}`}
				name={studio.name}
			/>
			<StudioAbout
				name={studio.name}
				description={studio.description}
				anotation={studio.annotation}
				studioPhotos={studio.photos}
				stats={studio.stats}
			/>
			<div className='text-4xl mb-20 font-semibold max-h-[75vh] tracking-tight text-pretty text-white sm:text-5xl overflow-hidden'>
				<h2
					className={cn(
						'mb-12 text-4xl font-semibold tracking-tight text-pretty text-white sm:text-5xl',
					)}>
					Фотографии студии:
				</h2>
				<StudioPhotos
					photos={studio.photos.map((p) => ({
						...p,
						url: `${process.env.NEXT_PUBLIC_S3_URL}/studio-photos/${p.id}.${
							p.url
						}`,
					}))}
				/>
			</div>
			{studio.team.length > 0 && <StudiosTeam people={studio.team} />}
			{studio.lattitude && studio.longitude && (
				<div className='mt-10'>
					<YMap
						lattitude={studio.lattitude}
						longitude={studio.longitude}
						address={studio.address}
					/>
				</div>
			)}
			{studio.contactUrl && (
				<div className='mt-5'>
					<Link href={studio.contactUrl}>Контакт</Link>
				</div>
			)}
		</>
	);
}
