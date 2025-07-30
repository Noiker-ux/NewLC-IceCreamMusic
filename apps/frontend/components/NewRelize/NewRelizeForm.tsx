'use client';
import { TReleaseInsertForm } from '@/schema/release.schema';
import { Button } from '@heroui/button';
import { Tab, Tabs } from '@heroui/tabs';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import Countyes from './Relize/Countryes/Countryes';
import Identify from './Relize/Identify/Identify';
import Label from './Relize/Label/Label';
import MainDates from './Relize/MainDates/MainDates';
import PersonsAndRoles from './Relize/PersonsAndRoles/PersonsAndRoles';
import Platfroms from './Relize/Platforms/Platfroms';
import Preview from './Relize/Preview/Preview';
import WorkWithRelize from './Relize/WorkWithRelize/WorkWithRelize';
import Tracks from './Tracks/Tracks';
import AdditionalParams from './Additional/AdditionalParams/AdditionalParams';
import YandexMusic from './Additional/YandexMusic/YandexMusic';
import CheckRelizeForm from './CheckRelizeForm/CheckRelizeForm';
import CommentForModerator from './Additional/CommentForModerator/CommentForModerator';
import { action } from './action';

export default function NewRelizeForm() {
	const methods = useForm<TReleaseInsertForm>({
		mode: 'onSubmit',
		defaultValues: {
			labelName: 'ICECREAMMUSIC',
			area: {
				data: ['all'],
			},
			platforms: ['all'],
		},
	});
	const {} = methods;

	const onSubmit: SubmitHandler<TReleaseInsertForm> = (data) => {
		action({
			...data,
			preview: data.preview.name.split('.')[1],
			tracks: data.tracks.map((track) => ({
				...track,
				track: track.track.name.split('.')[1],
				video: track.video?.name.split('.')[1],
				video_shot: track.video_shot?.name.split('.')[1],
				text_sync: track.text_sync?.name.split('.')[1],
				ringtone: track.ringtone?.name.split('.')[1],
			})),
		});
		console.log(data);
	};

	return (
		<FormProvider {...methods}>
			<form onSubmit={methods.handleSubmit(onSubmit)}>
				<div className='w-full'>
					<Tabs aria-label='Main'>
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
					</Tabs>
				</div>
			</form>
		</FormProvider>
	);
}
