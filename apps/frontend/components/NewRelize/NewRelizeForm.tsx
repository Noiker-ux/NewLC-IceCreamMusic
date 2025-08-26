'use client';
import { TReleaseInsertForm } from '@/schema/release.schema';
import { uploadBlob } from '@/shared/lib/upload/stream';
import { Button } from '@heroui/button';
import { Tab, Tabs } from '@heroui/tabs';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { releaseInsertFormSchema } from 'shared/schema/release.schema';
import { TActionResult } from '../Account/actionGetPersonalData';
import AdditionalParams from './Additional/AdditionalParams/AdditionalParams';
import CommentForModerator from './Additional/CommentForModerator/CommentForModerator';
import YandexMusic from './Additional/YandexMusic/YandexMusic';
import CheckRelizeForm from './CheckRelizeForm/CheckRelizeForm';
import Countyes from './Relize/Countryes/Countryes';
import Identify from './Relize/Identify/Identify';
import Label from './Relize/Label/Label';
import MainDates from './Relize/MainDates/MainDates';
import PersonsAndRoles from './Relize/PersonsAndRoles/PersonsAndRoles';
import Platfroms from './Relize/Platforms/Platfroms';
import Preview from './Relize/Preview/Preview';
import WorkWithRelize from './Relize/WorkWithRelize/WorkWithRelize';
import Tracks from './Tracks/Tracks';
import { UploadVisualizer } from './Upload/UploadVisualizer';
import { action } from './action';

type TUploadBase = {
	file: File;
	url: string;
};

type TUploadFile =
	| (TUploadBase & { belongsTo: 'release'; type: 'preview' })
	| (TUploadBase & {
			belongsTo: 'track';
			trackIndex: number;
			type: 'track' | 'text_sync' | 'video' | 'video_shot' | 'ringtone';
	  });

type TUploadResult = TUploadFile & {
	progress: number;
	result?: TActionResult<string>;
	retry?: () => void;
	title: string;
};

const localization: Record<TUploadFile['type'], string> = {
	preview: 'Файл превью',
	track: 'Файл трека',
	text_sync: 'Файл синхронизации текста',
	video: 'Файл видео',
	video_shot: 'Файл видео-шота',
	ringtone: 'Файл рингтона',
};

export default function NewRelizeForm() {
	const [currentTab, setCurrentTab] = useState<string | number>('Main');

	const [tabsBlocked, setTabsBlocked] = useState(false);

	const router = useRouter();

	const [uploadResults, setUploadResults] = useState<TUploadResult[]>([]);

	const methods = useForm<TReleaseInsertForm>({
		mode: 'onSubmit',
		resolver: zodResolver(releaseInsertFormSchema),
		defaultValues: {
			labelName: 'ICECREAMMUSIC',
			area: {
				negate: false,
				data: ['all'],
			},
			platforms: ['all'],
			tracks: [],
		},
	});

	const onSubmit: SubmitHandler<TReleaseInsertForm> = async (data) => {
		// console.log('🚀 ~ onSubmit ~ data:', data);

		const urlsResult = await action({
			...data,
			preview: data.preview.name.split('.').at(-1)!,
			tracks: data.tracks.map((track) => ({
				...track,
				track: track.track.name.split('.').at(-1)!,
				video: track.video?.name.split('.').at(-1),
				video_shot: track.video_shot?.name.split('.').at(-1),
				text_sync: track.text_sync?.name.split('.').at(-1),
				ringtone: track.ringtone?.name.split('.').at(-1),
			})),
		});

		if (!urlsResult.success) {
			return;
		}

		// console.log('🚀 ~ onSubmit ~ urlsResult.data:', urlsResult.data);

		const filesToUpload: TUploadFile[] = [
			{
				file: data.preview,
				url: urlsResult.data.preview,
				belongsTo: 'release',
				type: 'preview',
			},
		];

		const tracksLen = urlsResult.data.tracks.length;

		for (let trackIndex = 0; trackIndex < tracksLen; trackIndex++) {
			filesToUpload.push({
				file: data.tracks[trackIndex].track,
				url: urlsResult.data.tracks[trackIndex].track,
				type: 'track',
				belongsTo: 'track',
				trackIndex,
			});

			const trackTextSync = data.tracks[trackIndex].text_sync;
			const trackTextSyncUrl = urlsResult.data.tracks[trackIndex].text_sync;

			if (trackTextSync && trackTextSyncUrl) {
				filesToUpload.push({
					file: trackTextSync,
					url: trackTextSyncUrl,
					type: 'text_sync',
					belongsTo: 'track',
					trackIndex,
				});
			}

			const trackVideo = data.tracks[trackIndex].video;
			const trackVideoUrl = urlsResult.data.tracks[trackIndex].video;

			if (trackVideo && trackVideoUrl) {
				filesToUpload.push({
					file: trackVideo,
					url: trackVideoUrl,
					type: 'video',
					belongsTo: 'track',
					trackIndex,
				});
			}

			const trackVideoShot = data.tracks[trackIndex].video_shot;
			const trackVideoShotUrl = urlsResult.data.tracks[trackIndex].video_shot;

			if (trackVideoShot && trackVideoShotUrl) {
				filesToUpload.push({
					file: trackVideoShot,
					url: trackVideoShotUrl,
					type: 'video_shot',
					belongsTo: 'track',
					trackIndex,
				});
			}

			const trackRingtone = data.tracks[trackIndex].ringtone;
			const trackRingtoneUrl = urlsResult.data.tracks[trackIndex].ringtone;

			if (trackRingtone && trackRingtoneUrl) {
				filesToUpload.push({
					file: trackRingtone,
					url: trackRingtoneUrl,
					type: 'ringtone',
					belongsTo: 'track',
					trackIndex,
				});
			}
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

		setTabsBlocked(true);

		setCurrentTab('Upload');
	};

	return (
		<FormProvider {...methods}>
			<form
				onSubmit={methods.handleSubmit(onSubmit, (data) => console.log(data))}>
				<div className='w-full'>
					<Tabs
						aria-label='Main'
						isDisabled={tabsBlocked}
						selectedKey={currentTab}
						onSelectionChange={setCurrentTab}>
						<Tab key='Main' title='Информация по релизу'>
							<div className='w-full grid grid-cols-4 gap-5'>
								<Preview />
								<div className='col-span-3  bg-zinc-900 rounded-xl'>
									<WorkWithRelize />
								</div>
								<Label />
								<div className='col-span-3  bg-zinc-900 rounded-xl'>
									<PersonsAndRoles />
								</div>
								<Identify />
								<div className='col-span-3  bg-zinc-900 rounded-xl'>
									<MainDates />
								</div>
								<div className='col-span-4'>
									<Countyes />
								</div>
								<div className='col-span-4'>
									<Platfroms />
								</div>
							</div>
						</Tab>
						<Tab key='Tracks' title='Список треков'>
							<Tracks />
						</Tab>
						<Tab key='Additional' title='Дополнительные параметры'>
							<div className='flex flex-col gap-5'>
								<AdditionalParams />
								<YandexMusic />
								<CommentForModerator />
							</div>
						</Tab>
						<Tab key='Check' title='Проверка'>
							<CheckRelizeForm />
							<Button
								className='bg-indigo-700 mx-auto text-center block'
								size='lg'
								type='submit'>
								Отправить релиз
							</Button>
						</Tab>
						<Tab key='Upload' title='Загрузка'>
							{uploadResults.length > 0 &&
								uploadResults.map((upload) => {
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
							{uploadResults.length === 0 && <p>Нечего загружать</p>}
							{uploadResults.every((upload) => upload.result?.success) &&
								uploadResults.length > 0 && (
									<button
										onClick={() => {
											router.push('/dashboard/relizes/my-relizes');
										}}>
										Завершить
									</button>
								)}
						</Tab>
					</Tabs>
				</div>
			</form>
		</FormProvider>
	);
}
