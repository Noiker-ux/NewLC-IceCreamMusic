import { TTrackInsertForm } from 'shared/schema/release.schema';
import { cn } from '@/utils/cn';
import clsx from 'clsx';
import { Reorder, useDragControls } from 'framer-motion';
import { motion } from 'motion/react';
import { RefObject, useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import { TbGridDots } from 'react-icons/tb';
import TracksForm from './TracksForm/TracksForm';

export type TTrackItem<C = Element | null> = {
	trackData: TTrackInsertForm;
	constraints: RefObject<C>;
	trackIndex: number;
};

export default function TrackItem({
	trackData,
	constraints,
	trackIndex,
}: TTrackItem) {
	const dragControls = useDragControls();

	const [showDetail, setShowDetail] = useState<boolean>(false);

	return (
		<Reorder.Item
			value={trackData}
			dragControls={dragControls}
			dragConstraints={constraints}
			// dragListener={false}
			as='div'>
			<div className='bg-zinc-900 z-10 dark:bg-zinc-900  p-4 mt-4 w-full mx-auto rounded-lg select-none'>
				<div className={cn('relative', 'shadow-sm')}>
					<div className='flex gap-5'>
						<div
							className='rounded-lg p-1 cursor-grab relative  w-fit h-fit'
							onPointerDown={(e) => {
								dragControls.start(e);
							}}>
							<TbGridDots size={25} />
						</div>

						<div className='flex flex-col items-start justify-start w-full cursor-auto'>
							<div className='flex justify-between w-full items-center gap-4'>
								<p className='text-base text-neutral-700 dark:text-neutral-300 truncate max-w-xs'>
									{trackData.track.name}
								</p>
								<div className='flex items-center gap-2'>
									<p className='rounded-lg px-2 py-1 w-fit shrink-0 text-sm text-neutral-600 dark:bg-neutral-800 dark:text-white shadow-input'>
										{(trackData.track.size / (1024 * 1024)).toFixed(2)}
										MB
									</p>
									<div
										onClick={() => setShowDetail(!showDetail)}
										className='rounded-lg cursor-pointer p-[6px] aspect-square items-center justify-center flex w-fit shrink-0 text-sm text-neutral-600 dark:bg-neutral-800 dark:text-white shadow-input'>
										<IoIosArrowDown
											className={clsx(
												'rotate-0 transition-transform',
												showDetail && 'rotate-180',
											)}
										/>
									</div>
								</div>
							</div>
							<div className='flex text-sm md:flex-row flex-col items-start md:items-center w-full mt-2 justify-between text-neutral-600 dark:text-neutral-400'>
								<p className='px-1 py-0.5 rounded-lg bg-gray-100 dark:bg-neutral-800 '>
									{trackData.track.type}
								</p>

								<p>
									Изменен{' '}
									{new Date(trackData.track.lastModified).toLocaleDateString()}
								</p>
							</div>
						</div>
					</div>

					<motion.div
						initial={{ height: '0px' }}
						animate={{ height: showDetail ? 'auto' : '0px' }}
						className={
							'mt-4 gap-10 w-full cursor-auto grid  grid-cols-4  overflow-hidden'
						}>
						<TracksForm trackIndex={trackIndex} />
					</motion.div>
				</div>
			</div>
		</Reorder.Item>
	);
}
