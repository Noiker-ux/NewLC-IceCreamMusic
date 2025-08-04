import { CiPlay1 } from 'react-icons/ci';

import { Button } from '@heroui/button';

import { Tooltip } from '@heroui/tooltip';

import {
	MusicalNoteIcon,
	Bars3BottomLeftIcon,
	PlayCircleIcon,
	DocumentTextIcon,
	ArrowDownTrayIcon,
} from '@heroicons/react/24/outline';
import { TTrack } from 'shared/schema/release.schema';
import { Primitive } from 'sdk';
import React from 'react';
export default function MusicList({ tracks }: { tracks: Primitive<TTrack>[] }) {
	return (
		<div className='mt-3'>
			<div className='grid grid-cols-[50px,50px,1fr,1fr,1fr,1fr,1fr,200px] border-t-1 border-b-1  border-zinc-800 justify-between py-2 px-5'>
				<p>№</p>
				<p></p>
				<p className='text-center'>Название</p>
				<p className='text-center'>Подзаголовок</p>
				<p className='text-center'>Длительность</p>
				<p className='text-center'>Доля прав</p>
				<p className='text-center'>Сервисы</p>
				<p className='text-end'>Файл</p>
			</div>

			<div className='grid gap-y-2 items-center grid-cols-[50px,50px,1fr,1fr,1fr,1fr,1fr,200px] py-2 px-5'>
				{tracks.map((track) => (
					<React.Fragment key={track.id}>
						<p>{track.index + 1}</p>
						<Button isIconOnly variant='light'>
							<CiPlay1 />
						</Button>
						<p className='text-center'>{track.title}</p>
						<p className='text-center'>{track.subtitle}</p>
						<p className='text-center'>02:36</p>
						<p className='text-center'>{track.author_rights}%</p>
						<div className='flex justify-center items-center'>
							<Tooltip
								content={
									<div className='p-2'>
										<p>Рингтон доступен</p>
									</div>
								}>
								<Button isIconOnly variant='light'>
									<MusicalNoteIcon width={20} />
								</Button>
							</Tooltip>
							<Tooltip
								content={
									<div className='p-2'>
										<p>Текст трека доступен</p>
									</div>
								}>
								<Button isIconOnly variant='light'>
									<Bars3BottomLeftIcon width={20} />
								</Button>
							</Tooltip>
							<Tooltip
								content={
									<div className='p-2'>
										<p>Синхронизированный текст трека доступен</p>
									</div>
								}>
								<Button isIconOnly variant='light'>
									<DocumentTextIcon width={20} />
								</Button>
							</Tooltip>
							<Tooltip
								content={
									<div className='p-2'>
										<p>Видео доступно</p>
										<p>Нажмите чтобы увидеть UPC, ISRC</p>
									</div>
								}>
								<Button isIconOnly variant='light'>
									<PlayCircleIcon width={20} />
								</Button>
							</Tooltip>
						</div>
						<div className='flex justify-end items-center'>
							<Button isIconOnly className='bg-indigo-700'>
								<ArrowDownTrayIcon width={20} />
							</Button>
						</div>
					</React.Fragment>
				))}
			</div>
		</div>
	);
}
