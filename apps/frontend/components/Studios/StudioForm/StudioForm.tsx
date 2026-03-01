'use client';
import {
	TUploadFile,
	TUploadResult,
} from '@/components/Upload/UploadVisualizer';
import { uploadBlob } from '@/shared/lib/upload/stream';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { Button } from '@heroui/button';
import { Input, Textarea } from '@heroui/input';
import { Link, NumberInput, Tooltip } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useCallback, useRef, useState } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import {
	createStudioUpsertSchema,
	studioInsertFormSchema,
	TStudioData,
	TStudioUpsertForm,
} from 'shared/schema/studio.schema';
import { UploadVisualizer } from '../../Upload/UploadVisualizer';
import { createStudio } from './actions';
import StudioPhotos from './StudioPhotos/StudioPhotos';
import StudioStats from './StudioStats/StudioStats';
import StudioTeam from './StudioTeam/StudioTeam';

export type TStudioForm = {
	studio?: TStudioData;
};

const localization: Partial<Record<TUploadFile['type'], string>> = {
	url: 'Фото',
	logo: 'Логотип',
	background: 'Фон',
	photo: 'Фото',
};

export default function StudioForm({ studio }: TStudioForm) {
	// Refs
	const LogoFileRef = useRef<HTMLInputElement | null>(null);
	const BackgroundFileRef = useRef<HTMLInputElement | null>(null);

	const isUpdating = !!studio;

	const schema = createStudioUpsertSchema(isUpdating);

	const [uploadResults, setUploadResults] = useState<TUploadResult[]>([]);

	// RHF
	const methods = useForm<TStudioUpsertForm>({
		resolver: zodResolver(schema),
	});
	const onSubmit: SubmitHandler<TStudioUpsertForm> = async (data) => {
		const filesToUpload: TUploadFile[] = [];

		if (!isUpdating) {
			const dataResult = studioInsertFormSchema.safeParse(data);

			if (!dataResult.success) {
				return;
			}

			const newStudioData = dataResult.data;

			const { stats, team, photos, ...studio } = newStudioData;

			const { background, logo } = studio;

			const urlsResult = await createStudio({
				...studio,
				background: background.name.split('.').at(-1)!,
				logo: logo.name.split('.').at(-1)!,
				stats,
				photos: photos.map((photo) => ({
					...photo,
					url: photo.name.split('.').at(-1)!,
				})),
				team: team.map((mate) => ({
					...mate,
					photo: mate.name.split('.').at(-1)!,
				})),
			});

			if (!urlsResult.success) {
				return;
			}

			filesToUpload.push({
				file: logo,
				url: urlsResult.data.studio.logo,
				belongsTo: 'studio',
				type: 'logo',
			});

			if (urlsResult.data.studio.background) {
				filesToUpload.push({
					file: background,
					url: urlsResult.data.studio.background,
					belongsTo: 'studio',
					type: 'background',
				});
			}

			const photoLen = urlsResult.data.photos.length;

			for (let photoIndex = 0; photoIndex < photoLen; photoIndex++) {
				filesToUpload.push({
					file: photos[photoIndex].url,
					url: urlsResult.data.photos[photoIndex].url,
					belongsTo: 'studio_photo',
					type: 'url',
				});
			}

			const teamLen = urlsResult.data.team.length;

			for (let teamIndex = 0; teamIndex < teamLen; teamIndex++) {
				filesToUpload.push({
					file: team[teamIndex].photo,
					url: urlsResult.data.team[teamIndex].photo,
					belongsTo: 'studio_team',
					type: 'photo',
				});
			}
		} else {
		}

		const uploadResults: TUploadResult[] = filesToUpload
			.map((f) => {
				let uploaderTitle = '';

				if (f.belongsTo === 'release') {
					uploaderTitle = `${localization[f.type]} к релизу`;
				}

				if (f.belongsTo === 'track') {
					uploaderTitle = `${localization[f.type]} к треку №${f.trackIndex + 1}`;
				}

				return {
					...f,
					title: uploaderTitle,
					progress: 0,
				};
			})
			.map((upload, index) => {
				const { retry } = uploadBlob({
					file: upload.file,
					uploadUrl: upload.url,
					onProgress: (progress) => {
						setUploadResults((prevResults) => {
							const preUpdated = prevResults.slice(0, index);

							const postUpdated = prevResults.slice(index + 1);

							const updated: TUploadResult = {
								...upload,
								progress,
							};
							return [...preUpdated, updated, ...postUpdated];
						});
					},
					onFinish: (result) => {
						setUploadResults((prevResults) => {
							const preUpdated = prevResults.slice(0, index);

							const postUpdated = prevResults.slice(index + 1);

							const updated: TUploadResult = {
								...upload,
								progress: 1,
								result,
							};

							return [...preUpdated, updated, ...postUpdated];
						});
					},
					meta: {
						filename: upload.title,
					},
				});
				return {
					...upload,
					retry,
				};
			});

		setUploadResults(uploadResults);
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
					<div className='flex flex-col gap-5 w-full '>
						<div className='bg-zinc-900 p-5 rounded-xl'>
							<p className='font-bold text-xl text-left'>Информация о студии</p>
							<div className='flex gap-5 '>
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
						</div>
						<div className='bg-zinc-900 p-5 rounded-xl'>
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
						</div>
						<p className='font-bold text-xl text-left'>Цифры студии</p>
						<StudioStats />
						<p className='font-bold text-xl text-left'>Фотографии студии</p>
						<StudioPhotos />
						<p className='font-bold text-xl text-left'>Информация о студии</p>
						<StudioTeam />
						<div className='bg-zinc-900 p-5 rounded-xl'>
							<p className='font-bold text-xl text-left'>
								Информация для карты
							</p>
							<div className='flex gap-5 mt-5'>
								<NumberInput
									step={0.01}
									label={'Широта'}
									labelPlacement='outside'
									value={methods.watch('lattitude') ?? 0}
									onChange={(e) => methods.setValue('lattitude', Number(e))}
								/>
								<NumberInput
									step={0.01}
									label={'Долгота'}
									labelPlacement='outside'
									value={methods.watch('longitude') ?? 0}
									onChange={(e) => methods.setValue('longitude', Number(e))}
								/>
							</div>
						</div>
						<div className='bg-zinc-900 p-5 rounded-xl'>
							<p className='font-bold text-xl text-left'>Контакт</p>
							<div className='flex gap-5 mt-5'>
								<Input
									label='Введите контактную ссылку'
									labelPlacement='outside'
									placeholder='Контактная ссылка'
									radius='sm'
									isRequired
									type='text'
									{...methods.register('contactUrl')}
								/>
							</div>
						</div>
						{uploadResults.length > 0 && (
							<div className='bg-zinc-900 p-5 rounded-xl'>
								{uploadResults.map((upload) => {
									return (
										<UploadVisualizer
											key={upload.url}
											file={upload.file}
											title={upload.title}
											result={upload.result}
											progress={upload.progress}
											retryAction={upload.retry}
										/>
									);
								})}
							</div>
						)}
					</div>
				</div>

				<Button color='success' type='submit' className='mt-8'>
					Добавить
				</Button>
			</form>
		</FormProvider>
	);
}
