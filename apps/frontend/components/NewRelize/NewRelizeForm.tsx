'use client';
import { TReleaseInsertForm } from '@/schema/release.schema';
import { Button } from '@heroui/button';
import { Tab, Tabs } from '@heroui/tabs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
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
import { FileUploader } from './Upload/FileUploader';
import { action } from './action';

type TUploadBase = {
	file: File;
	url: string;
};

type TUpload =
	| (TUploadBase & { belongsTo: 'release'; type: 'preview' })
	| (TUploadBase & {
			belongsTo: 'track';
			trackIndex: number;
			type: 'track' | 'text_sync' | 'video' | 'video_shot' | 'ringtone';
	  });

const localization: Record<TUpload['type'], string> = {
	preview: 'Файл превью',
	track: 'Файл трека',
	text_sync: 'Файл синхронизации текста',
	video: 'Файл видео',
	video_shot: 'Файл видео-шота',
	ringtone: 'Файл рингтона',
};

export default function NewRelizeForm() {
	const [currentTab, setCurrentTab] = useState<string | number>('Main');

	const [isTabsDisabled, setTabsDisabled] = useState<boolean>(false);

	const [filesToUpload, setFilesToUpload] = useState<TUpload[]>([]);

	const router = useRouter();

	const [uploadResults, setUploadResults] = useState<TActionResult<string>[]>(
		[],
	);

	useEffect(() => {
		const successUploads = uploadResults.filter((result) => result.success);
		const equalCount = successUploads.length === filesToUpload.length;
		const succesGreaterThanZero = successUploads.length > 0;
		if (equalCount && succesGreaterThanZero) {
			router.push('/dashboard/relizes/my-relizes');
		}
	}, [uploadResults, filesToUpload, router]);

	const methods = useForm<TReleaseInsertForm>({
		mode: 'onSubmit',
		defaultValues: {
			labelName: 'ICECREAMMUSIC',
			area: {
				negate: false,
				data: ['all'],
			},
			platforms: ['all'],
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

		const filesToUpload: TUpload[] = [
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

		setFilesToUpload(filesToUpload);

		setCurrentTab('Upload');

		setTabsDisabled(true);
	};

	return (
		<FormProvider {...methods}>
			<form onSubmit={methods.handleSubmit(onSubmit)}>
				<div className='w-full'>
					<Tabs
						aria-label='Main'
						isDisabled={isTabsDisabled}
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
							{filesToUpload.length > 0 &&
								isTabsDisabled &&
								filesToUpload.map((upload) => {
									let uploaderTitle = '';

									if (upload.belongsTo === 'release') {
										uploaderTitle = `${localization[upload.type]} к релизу`;
									}

									if (upload.belongsTo === 'track') {
										uploaderTitle = `${localization[upload.type]} к треку №${upload.trackIndex + 1}`;
									}

									return (
										<FileUploader
											key={upload.url}
											file={upload.file}
											uploadUrl={upload.url}
											title={uploaderTitle}
											setUploadResult={(p) => {
												setUploadResults((prev) => [...prev, p]);
											}}
										/>
									);
								})}
						</Tab>
					</Tabs>
				</div>
			</form>
		</FormProvider>
	);
}
