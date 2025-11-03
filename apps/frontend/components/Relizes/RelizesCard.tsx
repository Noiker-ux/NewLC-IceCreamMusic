'use client';
import { cn } from '@/utils/cn';
import DateFormatter from '@/utils/dateFormatter';
import { LinkIcon, SquaresPlusIcon } from '@heroicons/react/24/outline';
import { Button, Link, Tooltip } from '@heroui/react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import { Primitive } from 'sdk';
import { TGetReleaseListResponse } from 'sdk/lib/release/release.controller';
import {
	releaseAreaSchema,
	releasePlatformsSchema,
} from 'shared/schema/release.schema';
import Areas from '../NewRelize/CheckRelizeForm/Areas/Areas';
import Platforms from '../NewRelize/CheckRelizeForm/Platfroms/Platforms';
import MusicList from './MusicList';

export default function RelizecCard({
	release,
	isAdmin,
}: {
	release: Primitive<TGetReleaseListResponse['data'][number]>;
	isAdmin: boolean;
}) {
	const [showMusicList, setShowMusicList] = useState<boolean>(false);
	const router = useRouter();
	const pathname = usePathname();

	let areaData = release.area;

	if (typeof areaData === 'string') {
		areaData = JSON.parse(areaData);
	}

	const releaseAreaResult = releaseAreaSchema.safeParse(areaData);

	let platfromsData = release.platforms;

	if (typeof platfromsData === 'string') {
		platfromsData = JSON.parse(platfromsData);
	}

	const releasePlatformsResult =
		releasePlatformsSchema.safeParse(platfromsData);

	return (
		<div className='bg-zinc-900 p-5  gap-2 rounded-xl w-full grid grid-cols-4'>
			<div className='col-span-3'>
				<div className='flex gap-5'>
					<Image
						src={`${process.env.NEXT_PUBLIC_S3_URL}/previews/${release.id}.${release.preview}`}
						alt='Превью'
						width={110}
						height={110}
						className='rounded-lg w-[110px] h-[110px] object-cover'
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
						{releaseAreaResult.success && (
							<Areas areas={releaseAreaResult.data} />
						)}
						{!releaseAreaResult.success && <>Неверный формат данных</>}
					</div>
					<div>
						<p className='text-xs font-extralight text-gray-300'>Площадки</p>
						{releasePlatformsResult.success && (
							<Platforms platforms={releasePlatformsResult.data} />
						)}
						{!releasePlatformsResult.success && <>Неверный формат данных</>}
					</div>
					<div>
						<p className='text-xs font-extralight text-gray-300'>Жанр</p>
						<p className='text-sm '>{release.genre}</p>
					</div>
					<div>
						<p className='text-xs font-extralight text-gray-300'>Статус</p>
						<p className='text-sm '>
							{release.status == 'moderating' ? (
								<span className='text-indigo-400'>На модерации</span>
							) : release.status == 'approved' ? (
								<span className='text-green-500'>Завершен</span>
							) : (
								<span className='text-red-700'>Отклонен</span>
							)}
						</p>
					</div>
					<div>
						<p className='text-xs font-extralight text-gray-300'>Оплачен</p>
						<p className='text-sm '>
							{release.confirmed && <span className='text-green-400'>Да</span>}
							{!release.confirmed && !isAdmin && (
								<Button
									as={Link}
									href={`/dashboard/purchase/release/${release.id}`}>
									Оплатить
								</Button>
							)}
							{!release.confirmed && isAdmin && (
								<span className='text-red-700'>Нет</span>
							)}
						</p>
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
					<Button as={Link} href='/dashboard/marketing/promo-links' isIconOnly>
						<LinkIcon width={20} />
					</Button>
				</Tooltip>
				{/* <Tooltip
					content={
						<div className='p-2'>
							<p>Просмотр статуса отгрузки на площадки</p>
						</div>
					}>
					<Button as={Link} href='#' isIconOnly>
						<ClipboardDocumentCheckIcon width={20} />
					</Button>
				</Tooltip> */}
				{/* <Tooltip
					content={
						<div className='p-2'>
							<p>Просмотр информации о релизе</p>
						</div>
					}>
					<Button as={Link} href='#' isIconOnly>
						<InboxStackIcon width={20} />
					</Button>
				</Tooltip> */}
				<Tooltip
					content={
						<div className='p-2'>
							<p>Просмотр релиза</p>
						</div>
					}>
					<Button
						onPress={() => {
							router.push(`${pathname.split('/').at(-1)}/${release.id}`);
						}}
						isIconOnly>
						<SquaresPlusIcon width={20} />
					</Button>
				</Tooltip>
				{/* <Tooltip
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
				</Tooltip> */}
				{/* <Tooltip
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
				</Tooltip> */}
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
