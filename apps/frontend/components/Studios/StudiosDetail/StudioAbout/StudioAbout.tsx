import { cn } from '@/utils/cn';
import Image from 'next/image';
import Markdown from 'react-markdown';
import { TStudioStatData } from 'sdk/lib/studio/studio.controller';

export default function StudioAbout({
	name,
	description,
	anotation,
	studioPhotos,
	stats,
}: {
	name: string;
	description: string | null;
	anotation: string | null;
	studioPhotos: {
		name: string;
		id: string;
		url: string;
		studioId: string;
	}[];
	stats: TStudioStatData[];
}) {
	return (
		<div className='overflow-hidden  py-24 sm:py-32'>
			<div className='mx-auto'>
				<div className='max-w-4xl'>
					<p className='text-base/7 font-semibold text-wite'>О студии</p>
					<h1 className='mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-100 sm:text-5xl'>
						{name}
					</h1>
					<div className='mt-6 text-xl/8 text-balance text-gray-200 max-w-[85%]'>
						{anotation && <Markdown>{anotation}</Markdown>}
					</div>
				</div>
				<section className='mt-20 grid grid-cols-1 lg:grid-cols-2 lg:gap-x-8 lg:gap-y-16'>
					<div className='lg:pr-8 flex flex-col gap-3 text-xl/8 text-balance text-gray-200'>
						{description && <Markdown>{description}</Markdown>}
					</div>
					<div className='pt-16 lg:row-span-2 lg:-mr-16 xl:mr-auto'>
						<div className='-mx-8 grid grid-cols-2 gap-4 sm:-mx-16 sm:grid-cols-4 lg:mx-0 lg:grid-cols-2 lg:gap-4 xl:gap-8'>
							{studioPhotos.slice(0, 4).map((photo, idx) => (
								<div
									className={cn(
										'aspect-square overflow-hidden rounded-xl shadow-xl outline-1 -outline-offset-1 outline-black/10',
										idx % 2 === 0 && 'lg:-mt-40 -mt-8 ',
									)}
									key={photo.id}>
									<Image
										src={`${process.env.NEXT_PUBLIC_S3_URL}/studio-photos/${photo.id}.${photo.url}`}
										alt=''
										width={350}
										height={350}
										className='block size-full object-cover'
									/>
								</div>
							))}
						</div>
					</div>
					<div className='max-lg:mt-16 lg:col-span-1'>
						<p className='text-base/7 font-semibold text-gray-100'>
							Наши цифры
						</p>
						<hr className='mt-6 border-t border-gray-200' />
						<dl className='mt-6 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2'>
							{stats.map((stat) => (
								<div
									key={stat.id}
									className='flex flex-col gap-y-2 border-b border-dotted border-gray-200 pb-4'>
									<dt className='text-sm/6 text-gray-300'>{stat.name}</dt>
									<dd className='order-first text-6xl font-semibold tracking-tight'>
										<span>{stat.value}</span>
									</dd>
								</div>
							))}
						</dl>
					</div>
				</section>
			</div>
		</div>
	);
}
