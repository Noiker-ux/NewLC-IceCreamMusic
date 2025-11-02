'use client';
import { InformationCircleIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Button } from '@heroui/button';
import { Input, Textarea } from '@heroui/input';
import { Link, NumberInput, Tooltip } from '@heroui/react';
import Image from 'next/image';
import { useCallback, useMemo, useRef } from 'react';
import {
	FormProvider,
	SubmitHandler,
	useFieldArray,
	useForm,
	useFormContext,
} from 'react-hook-form';
import { TStudioData } from 'sdk/lib/studio/studio.controller';
import StudioStats from './StudioStats/StudioStats';
import StudioPhotos from './StudioPhotos/StudioPhotos';
import { zodResolver } from '@hookform/resolvers/zod';
import { studioSchema, TStudio } from 'shared/schema/studio.schema';

export default function StudioForm() {
	// Refs
	const LogoFileRef = useRef<HTMLInputElement | null>(null);
	const BackgroundFileRef = useRef<HTMLInputElement | null>(null);

	// RHF
	const methods = useForm<TStudio>({
		resolver: zodResolver(studioSchema),
	});
	const onSubmit: SubmitHandler<TStudio> = (e) => {
		console.log(e);
	};

	// Image Logo
	const handleFileLogoChange = useCallback(
		(newFiles: File[]) => {
			const newFile = newFiles.at(0);

			if (!!newFile) methods.setValue(`logo`, newFile);
		},
		[methods.setValue],
	);
	const LogoFileWatch = methods.watch(`logo`);

	// Image Background
	const handleFileBackgroundChange = useCallback(
		(newFiles: File[]) => {
			const newFile = newFiles.at(0);
			if (!!newFile) methods.setValue(`background`, newFile);
		},
		[methods.setValue],
	);
	const BackgroundFileWatch = methods.watch(`background`);

	return (
		<FormProvider {...methods}>
			<form
				onSubmit={methods.handleSubmit(onSubmit, console.log)}
				className='max-w-7xl text-center'>
				<div className='flex gap-10 '>
					<div className='flex flex-col gap-10 w-1/4'>
						<div className='w-full'>
							<p className='font-bold text-xl text-left'>Загрузка логотпа</p>
							<p className='max-w-xl mt-1 text-sm flex text-foreground-400 text-left'>
								Формат: .png, .jpg, .jpeg
								<br /> Максимальный размер: не более 10 MB
							</p>
							<div className='mt-4 flex flex-col gap-4 items-center'>
								<Image
									src={
										!LogoFileWatch
											? '/assets/NoPicture.jpg'
											: URL.createObjectURL(LogoFileWatch)
									}
									alt='Логотип студии'
									width={100}
									height={100}
									defaultValue={'/NoPicture.jpg'}
									className='w-full aspect-square object-cover'
								/>
								<Button
									size='md'
									radius='sm'
									className={'bg-indigo-700'}
									onPress={() => {
										if (LogoFileRef.current) {
											LogoFileRef!.current.click();
										}
									}}>
									Загрузить файл в форматах .png, .jpg, .jpeg
								</Button>
								<input
									type='file'
									name={`logo`}
									className='hidden'
									ref={LogoFileRef}
									onChange={(e) =>
										e.target.files &&
										handleFileLogoChange(Array.from(e.target.files))
									}
								/>
								<p>{LogoFileWatch?.name}</p>
							</div>
						</div>
						<hr />
						<div className='w-full'>
							<p className='font-bold text-xl text-left'>
								Загрузка заднего фона
							</p>
							<p className='max-w-xl mt-1 text-sm flex text-foreground-400 text-left'>
								Формат: .png, .jpg, .jpeg
								<br /> Максимальный размер: не более 10 MB
							</p>
							<div className='mt-4 flex flex-col gap-4 items-center'>
								<Image
									src={
										!BackgroundFileWatch
											? '/assets/NoPicture.jpg'
											: URL.createObjectURL(BackgroundFileWatch)
									}
									alt='Логотип студии'
									width={100}
									height={100}
									defaultValue={'/NoPicture.jpg'}
									className='w-full aspect-square object-cover'
								/>
								<Button
									size='md'
									radius='sm'
									className={'bg-indigo-700'}
									onPress={() => {
										if (BackgroundFileRef.current) {
											BackgroundFileRef!.current.click();
										}
									}}>
									Загрузить файл в форматах .png, .jpg, .jpeg
								</Button>
								<input
									type='file'
									name={`logo`}
									className='hidden'
									ref={BackgroundFileRef}
									onChange={(e) =>
										e.target.files &&
										handleFileBackgroundChange(Array.from(e.target.files))
									}
								/>
								<p>{BackgroundFileWatch?.name}</p>
							</div>
						</div>
					</div>
					<div className='flex flex-col gap-5 w-full'>
						<p className='font-bold text-xl text-left'>Информация о студии</p>
						<div className='flex gap-5'>
							<Input
								label='Введите наименование студии'
								labelPlacement='outside'
								placeholder='Наименование студии'
								radius='sm'
								isRequired
								type='text'
								{...methods.register('name')}
							/>
							<NumberInput
								label='Введите рейтинг студии'
								labelPlacement='outside'
								placeholder='Рейтинг студии'
								radius='sm'
								isRequired
								max={5}
								min={1}
								step={0.01}
								onChange={(e) => {
									methods.setValue('rating', Number(e));
								}}
								value={methods.watch('rating')}
							/>
						</div>
						<Textarea
							label='Введите адрес студии'
							labelPlacement='outside'
							placeholder='Адрес студии'
							radius='sm'
							isClearable
							isRequired
							{...methods.register('address')}
						/>
						<p className='font-bold text-xl text-left'>
							Детальная информация о студии
						</p>
						<Textarea
							label={
								<div className='flex items-center relative gap-1 right-0 z-50'>
									<p className='text-md'>Введите описание студии</p>
									<Tooltip
										size='md'
										content={
											<div className='max-w-xs p-3'>
												<p>
													Внимание! Для оформления текста следует использовать
													Markdown разметку.
												</p>
												<Link
													href='/'
													className='underline pt-5 text-indigo-400'>
													Документация Markdown
												</Link>
											</div>
										}>
										<InformationCircleIcon
											width={18}
											className='hover:text-indigo-400'
										/>
									</Tooltip>
								</div>
							}
							labelPlacement='outside'
							placeholder='Описание студии'
							radius='sm'
							isClearable
							isRequired
							{...methods.register('description')}
						/>
						<Textarea
							label={
								<div className='flex items-center relative gap-1 right-0 z-50'>
									<p className='text-md'>Введите аннотацию для студии</p>
									<Tooltip
										size='md'
										content={
											<div className='max-w-xs p-3'>
												<p>
													Внимание! Для оформления текста следует использовать
													Markdown разметку.
												</p>
												<Link
													href='/'
													className='underline pt-5 text-indigo-400'>
													Документация Markdown
												</Link>
											</div>
										}>
										<InformationCircleIcon
											width={18}
											className='hover:text-indigo-400'
										/>
									</Tooltip>
								</div>
							}
							labelPlacement='outside'
							placeholder='Аннотация студии'
							radius='sm'
							isClearable
							isRequired
							{...methods.register('annotation')}
						/>
						<p className='font-bold text-xl text-left'>Цифры студии</p>
						<StudioStats />
						<p className='font-bold text-xl text-left'>Фотографии студии</p>
						<StudioPhotos />
					</div>
				</div>
				<NumberInput
					step={0.01}
					value={methods.watch('lattitude') ?? 0}
					onChange={(e) => methods.setValue('lattitude', Number(e))}
				/>
				<NumberInput
					step={0.01}
					value={methods.watch('longitude') ?? 0}
					onChange={(e) => methods.setValue('longitude', Number(e))}
				/>
				<Button color='success' type='submit' className='mt-8'>
					Добавить
				</Button>
			</form>
		</FormProvider>
	);
}
