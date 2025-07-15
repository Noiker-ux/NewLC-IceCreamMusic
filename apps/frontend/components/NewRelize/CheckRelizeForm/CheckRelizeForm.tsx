'use client';
import { TReleaseInsertForm } from '@/schema/release.schema';
import { cn } from '@/utils/cn';
import DateFormatter from '@/utils/dateFormatter';
import Image from 'next/image';
import { useFormContext } from 'react-hook-form';
import {
	ArrowLongUpIcon,
	ArrowTopRightOnSquareIcon,
	ChevronUpIcon,
} from '@heroicons/react/24/outline';
import { Tooltip } from '@heroui/tooltip';
import { Modal, ModalHeader, useDisclosure } from '@heroui/modal';
import ModalAreas from './Areas/ModalAreas/ModalAreas';
import ModalPlatfroms from './ModalPlatforms/ModalPlatforms';
import Areas from './Areas/Areas';
import Platforms from './Platfroms/Platforms';
import { IconArrowBarToUp } from '@tabler/icons-react';

export default function CheckRelizeForm() {
	const { formState, getValues } = useFormContext<TReleaseInsertForm>();

	const values = getValues();

	return (
		<div>
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
					</>
				)}
			</div>
			<div className='bg-zinc-900 p-5 rounded-lg mt-5 max-w-7xl '>
				<div className='flex  gap-5   '>
					<Image
						src={'/assets/XaQw7AVPHNY.jpg'}
						width={110}
						height={110}
						alt=''
						className='rounded-md'
					/>

					<div className='flex justify-between w-full'>
						<div>
							<div>
								<p className='text-lg'>
									{values.title ? (
										values.title
									) : (
										<span className='text-red-500'>Не указано</span>
									)}
								</p>
								<p className='text-sm'>{values.subtitle}</p>
							</div>
							<div className='flex gap-10 mt-3'>
								<div>
									<p className='text-xs font-extralight text-gray-300'>
										Тип релиза
									</p>
									<p className='text-sm'>
										{values.type ? (
											values.type
										) : (
											<span className='text-red-500'>Не указано</span>
										)}
									</p>
								</div>
								<div>
									<p className='text-xs font-extralight text-gray-300'>Жанр</p>
									<p className='text-sm'>
										{values.genre ? (
											values.genre
										) : (
											<span className='text-red-500'>Не указано</span>
										)}
									</p>
								</div>
								<div>
									<p className='text-xs font-extralight text-gray-300'>Лейбл</p>
									<p className='text-sm'>{values.label}</p>
								</div>
								{values.upc && (
									<div>
										<p className='text-xs font-extralight text-gray-300'>UPC</p>
										<p className='text-sm'>{values.upc}</p>
									</div>
								)}
							</div>
						</div>
						<p className='text-sm text-end'>
							{values.language ? (
								values.language
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
						<p className='text-sm '>{DateFormatter(values.preorderDate)}</p>
					</div>
					<div>
						<p className='text-xs font-extralight text-gray-300'>Дата релиза</p>
						<p className='text-sm '>{DateFormatter(values.releaseDate)}</p>
					</div>
					<div>
						<p className='text-xs font-extralight text-gray-300'>Дата старта</p>
						<p className='text-sm '>{DateFormatter(values.startDate)}</p>
					</div>
					<div>
						<p className='text-xs font-extralight text-gray-300 flex'>
							Территории
						</p>
						<Areas areas={values.area} />
					</div>
					<div>
						<p className='text-xs font-extralight text-gray-300'>Площадки</p>
						<Platforms platforms={values.platforms} />
					</div>
				</div>
				{values.roles.filter((r) => {
					return r.role === 'Исполнитель';
				}).length ? (
					<div className='mt-3'>
						<p className='text-sm'>
							Исполнители:{' '}
							{values.roles
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
				{values.roles.filter((r) => {
					return r.role === 'feat.';
				}).length > 0 && (
					<div className='mt-1'>
						<p className='text-sm'>
							feat:{' '}
							{values.roles
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
				<div className='inline-block hover:text-indigo-700'>
					<p className='mt-3 cursor-pointer'>Список треков</p>
					<ChevronUpIcon width={20} />
				</div>
			</div>
		</div>
	);
}
