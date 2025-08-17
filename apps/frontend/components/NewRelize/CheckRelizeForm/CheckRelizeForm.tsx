'use client';
import { TReleaseInsertForm } from '@/schema/release.schema';
import { cn } from '@/utils/cn';
import DateFormatter from '@/utils/dateFormatter';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useFormContext } from 'react-hook-form';
import Areas from './Areas/Areas';
import Platforms from './Platfroms/Platforms';
import { useState } from 'react';
import { motion } from 'motion/react';
import { releasePreviewSchema } from 'shared/schema/release.schema';

export default function CheckRelizeForm() {
	const { formState, getValues } = useFormContext<TReleaseInsertForm>();

	const [releaseValues] = useState(() => getValues());

	const [showTracks, setShowTracks] = useState(false);

	return (
		<div className='mb-5'>
			<div
				className={cn(
					'w-full   p-5 bg-red-500 rounded-xl',
					formState.isValid && 'bg-green-600',
				)}>
				{formState.isValid ? (
					<p className='text-lg'>
						Форма заполненна корректна и готова к отправке
					</p>
				) : (
					<>
						<p className='text-lg'>
							В форме присутствуют обязательные поля, которые вы пропустили:
						</p>
						{(
							Object.keys(formState.errors) as (keyof typeof formState.errors)[]
						).map((ek) => (
							<p key={ek}>{formState.errors[ek]?.message}</p>
						))}
					</>
				)}
			</div>
			<div className='bg-zinc-900 p-5 rounded-lg mt-5 max-w-7xl '>
				<div className='flex  gap-5   '>
					<div
						className={cn('min-w-[110px] h-[110px] relative rounded-md', {
							'border-white border-[2px]': !!!releaseValues.preview,
						})}>
						{releaseValues.preview && (
							<Image
								src={URL.createObjectURL(releaseValues.preview)}
								fill
								alt='release-preview'
							/>
						)}
					</div>

					<div className='flex justify-between w-full'>
						<div>
							<div>
								<p className='text-lg'>
									{releaseValues.title ? (
										releaseValues.title
									) : (
										<span className='text-red-500'>Не указано</span>
									)}
								</p>
								<p className='text-sm'>{releaseValues.subtitle}</p>
							</div>
							<div className='flex gap-10 mt-3'>
								<div>
									<p className='text-xs font-extralight text-gray-300'>
										Тип релиза
									</p>
									<p className='text-sm'>
										{releaseValues.type ? (
											releaseValues.type
										) : (
											<span className='text-red-500'>Не указано</span>
										)}
									</p>
								</div>
								<div>
									<p className='text-xs font-extralight text-gray-300'>Жанр</p>
									<p className='text-sm'>
										{releaseValues.genre ? (
											releaseValues.genre
										) : (
											<span className='text-red-500'>Не указано</span>
										)}
									</p>
								</div>
								<div>
									<p className='text-xs font-extralight text-gray-300'>Лейбл</p>
									<p className='text-sm'>{releaseValues.labelName}</p>
								</div>
								{releaseValues.upc && (
									<div>
										<p className='text-xs font-extralight text-gray-300'>UPC</p>
										<p className='text-sm'>{releaseValues.upc}</p>
									</div>
								)}
							</div>
						</div>
						<p className='text-sm text-end'>
							{releaseValues.language ? (
								releaseValues.language
							) : (
								<span className='text-red-500'>Не указано</span>
							)}
						</p>
					</div>
				</div>
				<div className='flex gap-10 mt-3  w-full'>
					<div>
						<p className='text-xs font-extralight text-gray-300'>
							Дата предзаказа
						</p>
						<p className='text-sm '>
							{DateFormatter(releaseValues.preorderDate)}
						</p>
					</div>
					<div>
						<p className='text-xs font-extralight text-gray-300'>Дата релиза</p>
						<p className='text-sm '>
							{DateFormatter(releaseValues.releaseDate)}
						</p>
					</div>
					<div>
						<p className='text-xs font-extralight text-gray-300'>Дата старта</p>
						<p className='text-sm '>{DateFormatter(releaseValues.startDate)}</p>
					</div>
					<div>
						<p className='text-xs font-extralight text-gray-300 flex'>
							Территории
						</p>
						<Areas areas={releaseValues.area} />
					</div>
					<div>
						<p className='text-xs font-extralight text-gray-300'>Площадки</p>
						<Platforms platforms={releaseValues.platforms} />
					</div>
				</div>
				{releaseValues.roles.filter((r) => {
					return r.role === 'Исполнитель';
				}).length ? (
					<div className='mt-3'>
						<p className='text-sm'>
							Исполнители:{' '}
							{releaseValues.roles
								.filter((r) => {
									return r.role === 'Исполнитель';
								})
								.map((r) => {
									return r.person;
								})
								.join(', ')}
						</p>
					</div>
				) : (
					<p className='mt-3 text-sm'>
						Исполнители: <span className='text-red-500'>Не указано</span>
					</p>
				)}
				{releaseValues.roles.filter((r) => {
					return r.role === 'feat.';
				}).length > 0 && (
					<div className='mt-1'>
						<p className='text-sm'>
							feat:{' '}
							{releaseValues.roles
								.filter((r) => {
									return r.role === 'feat.';
								})
								.map((r) => {
									return r.person;
								})
								.join(', ')}
						</p>
					</div>
				)}
				{!!releaseValues.tracks.length && (
					<>
						<button
							className='mt-3 flex hover:text-indigo-700 items-center gap-1'
							onClick={() => setShowTracks((show) => !show)}
							type='button'>
							<p className=' cursor-pointer'>Список треков</p>
							<motion.div
								animate={{
									rotate: showTracks ? 180 : 0,
								}}
								initial={{ rotate: 0 }}>
								<ChevronDownIcon width={20} />
							</motion.div>
						</button>
						<motion.div
							initial={{ height: 0 }}
							animate={{ height: !showTracks ? 0 : 'auto' }}
							className='overflow-hidden '>
							{releaseValues.tracks.map((track) => (
								<p key={track.title}>{track.title}</p>
							))}
						</motion.div>
					</>
				)}
			</div>
		</div>
	);
}
