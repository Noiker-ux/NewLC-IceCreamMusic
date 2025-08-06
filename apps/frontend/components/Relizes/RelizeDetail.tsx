import { use } from 'react';
import { actionGetRelizeById } from './actionGetRelizeById';
import Image from 'next/image';
import Link from 'next/link';
import DateFormatter from '@/utils/dateFormatter';
import Areas from '../NewRelize/CheckRelizeForm/Areas/Areas';
import Platforms from '../NewRelize/CheckRelizeForm/Platfroms/Platforms';
import ModalTextTrack from './ModalTextTrack';
import FileList from './FileList';
import { TReleaseRoles } from 'shared/schema/release.schema';

export default function RelizeDetail({ relizeID }: { relizeID: string }) {
	const { data } = use(actionGetRelizeById(relizeID));

	return (
		<>
			<div className='flex gap-5 bg-zinc-900 p-5 max-w-7xl rounded-xl'>
				<div className='flex flex-col gap-3 w-fit'>
					<Image
						src={`${process.env.NEXT_PUBLIC_S3_URL}/previews/${data.id}.${data.preview}`}
						alt='Превью'
						width={200}
						height={200}
						className='rounded-lg w-[200px] h-[200px] object-cover'
					/>
					<Link
						download
						href={`${process.env.NEXT_PUBLIC_S3_URL}/previews/${data.id}.${data.preview}`}
						className='bg-indigo-700 hover:bg-indigo-600 rounded-md p-2 inline-block text-center'>
						Скачать превью
					</Link>
				</div>
				<div className='grid grid-cols-2 gap-x-10 gap-y-5 '>
					<div>
						<p className='text-xl'>Общая информация релизе</p>
						<p className='text-gray-400 mt-3'>
							Язык метаданных:{' '}
							<span className='text-white'>{data.language}</span>
						</p>
						<p className='text-gray-400'>
							Название релиза: <span className='text-white'>{data.title}</span>
						</p>
						<p className='text-gray-400'>
							Подзаголовок релиза:{' '}
							<span className='text-white'>{data.subtitle ?? '-'}</span>
						</p>
						<p className='text-gray-400'>
							Жанр: <span className='text-white'>{data.genre ?? '-'}</span>
						</p>
						<p className='text-gray-400'>
							Тип релиза: <span className='text-white'>{data.type ?? '-'}</span>
						</p>
					</div>
					<div>
						<p className='text-xl'>Персоны и роли</p>
						<p className='text-gray-400 mt-3 flex flex-row gap-1'>
							Исполнители:{' '}
							<span className='flex gap-3 flex-wrap'>
								{JSON.parse(JSON.stringify(data.roles))
									.filter(
										(r: TReleaseRoles[number]) => r.role === 'Исполнитель',
									)
									.map((r: TReleaseRoles[number]) => (
										<span className='text-white' key={r.person}>
											{r.person}
										</span>
									))}
							</span>
						</p>
						<p className='text-gray-400  flex flex-row gap-1'>
							Feat:{' '}
							<span className='flex gap-3 flex-wrap'>
								{JSON.parse(JSON.stringify(data.roles))
									.filter((r: TReleaseRoles[number]) => r.role === 'feat.')
									.map((r: TReleaseRoles[number]) => (
										<span className='text-white' key={r.person}>
											{r.person}
										</span>
									))}
							</span>
						</p>
					</div>
					<div>
						<p className='text-xl'>Лейбл и идентификация</p>
						<p className='text-gray-400 mt-3'>
							Наименование лейбла:{' '}
							<span className='text-white'>{data.labelName ?? '-'}</span>
						</p>
						<p className='text-gray-400 '>
							UPC: <span className='text-white'>{data.upc ?? '-'}</span>
						</p>
					</div>
					<div>
						<p className='text-xl'>Основные даты релиза</p>
						<p className='text-gray-400 mt-3'>
							Дата предзаказа:{' '}
							<span className='text-white'>
								{DateFormatter(new Date(data.preorderDate))}
							</span>
						</p>
						<p className='text-gray-400 '>
							Дата старта:{' '}
							<span className='text-white'>
								{DateFormatter(new Date(data.startDate))}
							</span>
						</p>
						<p className='text-gray-400 '>
							Дата релиза:{' '}
							<span className='text-white'>
								{DateFormatter(new Date(data.releaseDate))}
							</span>
						</p>
					</div>

					<div>
						<p className='text-xl'>Страны распространения</p>
						<div className='text-white mt-3'>
							<Areas areas={JSON.parse(JSON.stringify(data.area))} />
						</div>
					</div>

					<div>
						<p className='text-xl'>Платформы распространения</p>
						<div className='text-white mt-3'>
							<Platforms
								platforms={JSON.parse(JSON.stringify(data.platforms))}
							/>
						</div>
					</div>
				</div>
				<div>
					<p className='text-xl'>Дополнительные настройки</p>
					<p className='text-gray-400 mt-3'>
						Ранний старт в России:{' '}
						<span className='text-white'>
							{data.earlyStartInRussia ? '✅' : '❌'}
						</span>
					</p>
					<p className='text-gray-400 '>
						Доставка в реальном времени:{' '}
						<span className='text-white'>
							{data.realTimeDelivery ? '✅' : '❌'}
						</span>
					</p>
					<p className='text-gray-400 '>
						Яндекс музыка (Скоро новый релиз):{' '}
						<span className='text-white'>
							{data.yandexSoonNewRelease
								? DateFormatter(new Date(data.yandexSoonNewRelease))
								: '-'}
						</span>
					</p>
				</div>
			</div>
			<p className='mt-3 relative max-w-7xl text-2xl after:w-[calc(100%-170px)] after:h-[1px] after:bg-red-50 after:right-0 after:bottom-0 after:my-auto after:absolute after:top-0'>
				Список треков
			</p>
			{data.tracks.map((track) => (
				<div
					key={track.id}
					className='mt-3 bg-zinc-900 rounded-xl p-5 max-w-7xl'>
					<div className='flex gap-2 items-center'>
						Файлы:{' '}
						<div className='flex gap-2'>
							<FileList track={track} downloadTrackFile={true} />
						</div>
					</div>
					<div className='grid grid-cols-4 gap-x-5 gap-y-5 mt-5'>
						<div>
							<p className='text-xl'>Общая информация о треке</p>
							<p className='text-gray-400 mt-3'>
								Название трека:{' '}
								<span className='text-white'>{track.title ?? '-'}</span>
							</p>
							<p className='text-gray-400 '>
								Подзаголовок трека:{' '}
								<span className='text-white'>{track.subtitle ?? '-'}</span>
							</p>
						</div>
						<div>
							<p className='text-xl'>Идентификация</p>
							<p className='text-gray-400 mt-3'>
								ISRC: <span className='text-white'>{track.isrc ?? '-'}</span>
							</p>
							<p className='text-gray-400'>
								Код партнера:{' '}
								<span className='text-white'>{track.partner_code ?? '-'}</span>
							</p>
						</div>
						<div>
							<p className='text-xl'>Персоны и роли</p>
							<p className='flex flex-wrap text-gray-400 gap-1 mt-3'>
								Исполнитель(и):{' '}
								<span className='flex gap-3 flex-wrap'>
									{JSON.parse(JSON.stringify(track.roles))
										.filter(
											(r: TReleaseRoles[number]) => r.role === 'Исполнитель',
										)
										.map((r: TReleaseRoles[number]) => (
											<span className='text-white' key={r.person}>
												{r.person}
											</span>
										))}
								</span>
							</p>
							<p className='flex flex-wrap text-gray-400 gap-1'>
								feat(s):{' '}
								<span className='flex gap-3 flex-wrap'>
									{JSON.parse(JSON.stringify(track.roles))
										.filter((r: TReleaseRoles[number]) => r.role === 'feat.')
										.map((r: TReleaseRoles[number]) => (
											<span className='text-white' key={r.person}>
												{r.person}
											</span>
										))}
								</span>
							</p>
							<p className='flex flex-wrap text-gray-400 gap-1'>
								Автор(ы) музыки:{' '}
								<span className='flex gap-3 flex-wrap'>
									{JSON.parse(JSON.stringify(track.roles))
										.filter(
											(r: TReleaseRoles[number]) => r.role === 'Автор музыки',
										)
										.map((r: TReleaseRoles[number]) => (
											<span className='text-white' key={r.person}>
												{r.person}
											</span>
										))}
								</span>
							</p>
							<p className='flex flex-wrap text-gray-400 gap-1'>
								Автор(ы) слов:{' '}
								<span className='flex gap-3 flex-wrap'>
									{JSON.parse(JSON.stringify(track.roles))
										.filter(
											(r: TReleaseRoles[number]) => r.role === 'Автор слов',
										)
										.map((r: TReleaseRoles[number]) => (
											<span className='text-white' key={r.person}>
												{r.person}
											</span>
										))}
								</span>
							</p>
						</div>
						<div>
							<p className='text-xl'>Права</p>
							<p className='text-gray-400 mt-3'>
								Авторские права:{' '}
								<span className='text-white'>
									{track.author_rights ?? '-'}%
								</span>
							</p>
							<p className='text-gray-400 '>
								Смежные права: <span className='text-white'>100%</span>
							</p>
						</div>
						<div>
							<p className='text-xl'>Дополнительные параметры</p>
							<p className='text-gray-400 mt-3'>
								Начало предпрослушивания:{' '}
								<span className='text-white'>{track.preview_start ?? '-'}</span>
							</p>
							<p className='text-gray-400'>
								Instant Gratification:{' '}
								<span className='text-white'>
									{track.instant_gratification
										? DateFormatter(new Date(track.instant_gratification))
										: '-'}
								</span>
							</p>
							<p className='text-gray-400'>
								Focus track:{' '}
								<span className='text-white'>{track.focus ? '✅' : '❌'}</span>
							</p>
						</div>
						<div>
							<p className='text-xl'>Версия трека</p>
							<p className='text-gray-400 mt-3'>
								Explicit Content:{' '}
								<span className='text-white'>
									{track.explicit ? '✅' : '❌'}
								</span>
							</p>
							<p className='text-gray-400'>
								Live:{' '}
								<span className='text-white'>{track.live ? '✅' : '❌'}</span>
							</p>
							<p className='text-gray-400'>
								Cover:{' '}
								<span className='text-white'>{track.cover ? '✅' : '❌'}</span>
							</p>
							<p className='text-gray-400'>
								Remix:{' '}
								<span className='text-white'>{track.remix ? '✅' : '❌'}</span>
							</p>
							<p className='text-gray-400'>
								Instrumental:{' '}
								<span className='text-white'>
									{track.instrumental ? '✅' : '❌'}
								</span>
							</p>
						</div>
						<div>
							<p className='text-xl'>Виды использования</p>
							<p className='text-gray-400 mt-3    '>
								Язык метаданных:{' '}
								<span className='text-white'>{track.language ?? '-'}</span>
							</p>
						</div>
					</div>
				</div>
			))}
			<p className='mt-3 relative max-w-7xl text-2xl after:w-[calc(100%-170px)] after:h-[1px] after:bg-red-50 after:right-0 after:bottom-0 after:my-auto after:absolute after:top-0'>
				Коментарий
			</p>
			<p className='mt-3'>{data.moderatorComment ?? '-'}</p>
		</>
	);
}
