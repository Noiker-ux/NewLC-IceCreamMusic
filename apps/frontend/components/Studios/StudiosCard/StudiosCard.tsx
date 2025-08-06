import Image from 'next/image';
import { Icon } from '@iconify/react';
import { TStudiosCard } from './StudiosCard.props';
import { unstable_ViewTransition as ViewTransition } from 'react';

export default function StudiosCard({
	name,
	preview,
	rating,
	place,
	id,
}: TStudiosCard) {
	return (
		<div
			className='w-full rounded-xl bg-zinc-900 relative h-fit cursor-pointer hover:scale-95 transition-all
        '>
			<ViewTransition name={`studioTransit-${id}`}>
				<Image
					src={preview}
					alt={''}
					width={250}
					height={250}
					className=' w-full aspect-square rounded-t-xl'
				/>
			</ViewTransition>
			<div className='py-3 px-5'>
				<div className='flex justify-between'>
					<p>{name}</p>
					<p className='flex gap-1 items-center'>
						<Icon
							icon={'heroicons:star'}
							aria-hidden='true'
							className={'shrink-0 size-6'}
							color='#ffd700'
						/>
						{rating}
					</p>
				</div>
				<div className='mt-2'>
					<p className='text-sm'>{place}</p>
				</div>
			</div>
		</div>
	);
}
