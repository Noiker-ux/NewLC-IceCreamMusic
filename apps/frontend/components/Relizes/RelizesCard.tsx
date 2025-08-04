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
import { TGetReleaseListResponse } from 'sdk/lib/release/release.controller';
import Platforms from '../NewRelize/CheckRelizeForm/Platfroms/Platforms';
import Areas from '../NewRelize/CheckRelizeForm/Areas/Areas';
import { Primitive } from 'sdk';
import DateFormatter from '@/utils/dateFormatter';

export default function RelizecCard({
	release,
}: {
	release: Primitive<TGetReleaseListResponse['data'][number]>;
}) {
	const [showMusicList, setShowMusicList] = useState<boolean>(false);

	return (
		<div className='bg-zinc-900 p-5  gap-2 rounded-xl w-full grid grid-cols-4'>
			<div className='col-span-3'>
				<div className='flex gap-5'>
					<Image
						src={`${process.env.NEXT_PUBLIC_S3_URL}/previews/${release.id}.${release.preview}`}
						alt='Превью'
						width={110}
						height={110}
						className='rounded-lg'
					/>
					<div className='flex flex-col justify-around'>
						<div>
							<p className='text-lg'>{release.title}</p>
							<p className='text-sm'>{release.subtitle}</p>
						</div>
						<div className='flex gap-5'>
							<div>
								<p className={'text-xs font-extralight text-gray-300'}>UPC</p>
								<p className='text-sm '>{release.upc}</p>
							</div>
							<div>
								<p className={'text-xs font-extralight text-gray-300'}>
									Название лейбла
								</p>
								<p className='text-sm'>{release.labelName}</p>
							</div>
						</div>
					</div>
				</div>
				<div className='flex gap-10 mt-4 w-full'>
					<div>
						<p className='text-xs font-extralight text-gray-300'>
							Дата предзаказа
						</p>
						<p className='text-sm '>
							{DateFormatter(new Date(release.preorderDate))}
						</p>
					</div>
					<div>
						<p className='text-xs font-extralight text-gray-300'>Дата релиза</p>
						<p className='text-sm '>
							{DateFormatter(new Date(release.releaseDate))}
						</p>
					</div>
					<div>
						<p className='text-xs font-extralight text-gray-300'>Дата старта</p>
						<p className='text-sm '>
							{DateFormatter(new Date(release.startDate))}
						</p>
					</div>
					<div>
						<p className='text-xs font-extralight text-gray-300'>Территории</p>
						<Areas areas={JSON.parse(JSON.stringify(release.area))} />
					</div>
					<div>
						<p className='text-xs font-extralight text-gray-300'>Площадки</p>
						<Platforms
							platforms={JSON.parse(JSON.stringify(release.platforms))}
						/>
					</div>
					<div>
						<p className='text-xs font-extralight text-gray-300'>Жанр</p>
						<p className='text-sm '>{release.genre}</p>
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
				{showMusicList && <MusicList tracks={release.tracks} />}
			</div>
		</div>
	);
}
