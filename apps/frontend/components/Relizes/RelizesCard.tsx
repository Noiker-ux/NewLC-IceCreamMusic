'use client';
import { useState } from 'react';
import Image from 'next/image';

import {
	TrashIcon,
	PencilSquareIcon,
	ClipboardDocumentCheckIcon,
	InboxStackIcon,
	SquaresPlusIcon,
	LinkIcon,
} from '@heroicons/react/24/outline';

import { IoIosArrowDown } from 'react-icons/io';
import { Button, Link, Tooltip } from '@heroui/react';
import MusicList from './MusicList';
import { cn } from '@/utils/cn';
export default function RelizecCard() {
	const [showMusicList, setShowMusicList] = useState<boolean>(false);

	return (
		<div className='bg-zinc-900 p-5  gap-2 rounded-xl w-full grid grid-cols-4'>
			<div className='col-span-3'>
				<div className='flex gap-5'>
					<Image
						src='/assets/XaQw7AVPHNY.jpg'
						alt='Превью'
						width={110}
						height={110}
						className='rounded-lg'
					/>
					<div className='flex flex-col justify-around'>
						<div>
							<p className='text-lg'>Название релиза</p>
							<p className='text-sm'>Подзаголовок релиза</p>
						</div>
						<div className='flex gap-5'>
							<div>
								<p className={'text-xs font-extralight text-gray-300'}>UPC</p>
								<p className='text-sm '>5063635506441</p>
							</div>
							<div>
								<p className={'text-xs font-extralight text-gray-300'}>
									Название лейбла
								</p>
								<p className='text-sm'>ICECREAMMUSIC</p>
							</div>
						</div>
					</div>
				</div>
				<div className='flex gap-10 mt-4 w-full'>
					<div>
						<p className='text-xs font-extralight text-gray-300'>
							Дата создания
						</p>
						<p className='text-sm '>2025-04-09</p>
					</div>
					<div>
						<p className='text-xs font-extralight text-gray-300'>Дата релиза</p>
						<p className='text-sm '>2025-04-11</p>
					</div>
					<div>
						<p className='text-xs font-extralight text-gray-300'>Дата старта</p>
						<p className='text-sm '>2025-04-11</p>
					</div>
					<div>
						<p className='text-xs font-extralight text-gray-300'>Территории</p>
						<p className='text-sm '>Все страны</p>
					</div>
					<div>
						<p className='text-xs font-extralight text-gray-300'>Площадки</p>
						<p className='text-sm '>56</p>
					</div>
					<div>
						<p className='text-xs font-extralight text-gray-300'>Жанр</p>
						<p className='text-sm '>Alternative Rock</p>
					</div>
				</div>
			</div>
			<div className='flex gap-3 justify-end'>
				<Tooltip
					content={
						<div className='p-2'>
							<p>Создать промо ссылку к релизу</p>
						</div>
					}>
					<Button
						as={Link}
						href='https://github.com/heroui-inc/heroui'
						isIconOnly>
						<LinkIcon width={20} />
					</Button>
				</Tooltip>
				<Tooltip
					content={
						<div className='p-2'>
							<p>Просмотр статуса отгрузки на площадки</p>
						</div>
					}>
					<Button
						as={Link}
						href='https://github.com/heroui-inc/heroui'
						isIconOnly>
						<ClipboardDocumentCheckIcon width={20} />
					</Button>
				</Tooltip>
				<Tooltip
					content={
						<div className='p-2'>
							<p>Просмотр информации о релизе</p>
						</div>
					}>
					<Button
						as={Link}
						href='https://github.com/heroui-inc/heroui'
						isIconOnly>
						<InboxStackIcon width={20} />
					</Button>
				</Tooltip>
				<Tooltip
					content={
						<div className='p-2'>
							<p>Просмотр релиза на площадках</p>
						</div>
					}>
					<Button
						as={Link}
						href='https://github.com/heroui-inc/heroui'
						isIconOnly>
						<SquaresPlusIcon width={20} />
					</Button>
				</Tooltip>
				<Tooltip
					content={
						<div className='p-2'>
							<p>Редактировать релиз</p>
						</div>
					}>
					<Button
						as={Link}
						href='https://github.com/heroui-inc/heroui'
						isIconOnly>
						<PencilSquareIcon width={20} />
					</Button>
				</Tooltip>
				<Tooltip
					content={
						<div className='p-2'>
							<p>Удалить релиз</p>
						</div>
					}>
					<Button
						as={Link}
						color='danger'
						href='https://github.com/heroui-inc/heroui'
						isIconOnly>
						<TrashIcon width={20} />
					</Button>
				</Tooltip>
			</div>
			<div className='col-span-4'>
				<p
					className='text-md flex gap-1 items-center cursor-pointer transition-all hover:text-indigo-400'
					onClick={() => {
						setShowMusicList(!showMusicList);
					}}>
					Список треков
					<IoIosArrowDown
						className={cn(
							'rotate-0 transition-all',
							showMusicList && 'rotate-180',
						)}
					/>
				</p>
				{showMusicList && <MusicList />}
			</div>
		</div>
	);
}
