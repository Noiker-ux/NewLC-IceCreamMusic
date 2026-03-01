'use client';
import { TReleaseUpsert } from 'shared/schema/release.schema';
import dateISOFormatter from '@/utils/dateISOFormatter';
import {
	CheckBadgeIcon,
	InformationCircleIcon,
} from '@heroicons/react/24/outline';
import { TimeInput } from '@heroui/date-input';
import { Checkbox, DatePicker } from '@heroui/react';
import { Tooltip } from '@heroui/tooltip';
import { parseAbsoluteToLocal, parseTime, Time } from '@internationalized/date';
import { I18nProvider } from '@react-aria/i18n';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { FaClock } from 'react-icons/fa';

export type TAdditionParametersTrackData = {
	trackIndex: number;
};

export default function AdditionParametersTrackData({
	trackIndex,
}: TAdditionParametersTrackData) {
	const { setValue, watch, register } = useFormContext<TReleaseUpsert>();

	const previewStart = watch(`tracks.${trackIndex}.preview_start`);
	const instantgratificationW = watch(
		`tracks.${trackIndex}.instant_gratification`,
	);

	const [showDateInstantGratification, setShowDateInstantGratification] =
		useState<boolean>(() => !!instantgratificationW);

	return (
		<div>
			<p className='font-extrabold'>Дополнительные параметры</p>
			<p className='text-xs text-foreground-400 mt-2'>
				Укажите дополнительные параметры для трека
			</p>
			<div className='flex mt-2 gap-5'>
				<TimeInput
					label={
						<div className='flex items-center gap-1'>
							<p className='text-md'>Начало предпрослушивания</p>
							<Tooltip
								size='md'
								content={
									<div className='max-w-xs p-3'>
										<p>
											С выбранной секунды начнется воспроизведение фрагмента:
										</p>
										<ul>
											<li className='flex gap-2'>
												<CheckBadgeIcon width={30} height={30} /> который будет
												спользован на сервисе VK Клипы
											</li>
											<li className='flex gap-2'>
												<CheckBadgeIcon width={30} height={30} />
												который будет использован как сниппет на VK Музыка
											</li>
											<li className='flex gap-2'>
												<CheckBadgeIcon width={30} height={30} />
												который будет проигрываться до покупки на iTunes
											</li>
											<li className='flex gap-2'>
												<CheckBadgeIcon width={30} height={30} />
												который будет использован как сниппет на AppleMusic
											</li>
											<li className='flex gap-2'>
												<CheckBadgeIcon width={30} height={30} />
												который будет использован как официальный звук на
												TikTok, Likee
											</li>
										</ul>
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
					startContent={<FaClock size={20} />}
					granularity='minute'
					hourCycle={24}
					hideTimeZone
					value={previewStart ? parseTime(previewStart) : undefined}
					onChange={(newTime) => {
						if (newTime) {
							const hour = newTime.hour.toString().padStart(2, '0');
							const minute = newTime.minute.toString().padStart(2, '0');
							setValue(
								`tracks.${trackIndex}.preview_start`,
								`${hour}:${minute}`,
							);
						}
					}}
				/>
			</div>
			<div className='flex flex-col gap-5 mt-4'>
				<Checkbox
					size='md'
					color='default'
					className='relative'
					isSelected={showDateInstantGratification}
					onValueChange={(v) => {
						if (!v)
							setValue(`tracks.${trackIndex}.instant_gratification`, undefined);
						setShowDateInstantGratification(v);
					}}>
					<div className='absolute -mt-[11px] z-50 flex gap-2 items-start	 min-w-80'>
						<p className='text-md'>Instant Gratification</p>
						<Tooltip
							className='max-w-sm p-3'
							content='Дата, когда открывается возможность прослушать часть треков с альбома (до 50%). Указанная дата должна быть позже даты предзаказа,, но ранее даты старта на площадках. Поддерживаемые площадки: iTunes, Apple Music, Яндекс Музыка и Youtube Music.'>
							<InformationCircleIcon
								width={20}
								height={20}
								className='hover:text-indigo-400'
							/>
						</Tooltip>
					</div>
				</Checkbox>
				{showDateInstantGratification && (
					<I18nProvider locale='ru-RU'>
						<DatePicker
							className='w-1/2 '
							labelPlacement='outside'
							label='Выберите дату'
							hideTimeZone={true}
							granularity='day'
							showMonthAndYearPickers={true}
							onChange={(value) => {
								setValue(
									`tracks.${trackIndex}.instant_gratification`,
									value ? value.toDate() : undefined,
								);
							}}
							value={
								instantgratificationW
									? parseAbsoluteToLocal(
											dateISOFormatter(instantgratificationW),
										)
									: undefined
							}
						/>
					</I18nProvider>
				)}
				<Checkbox
					size='md'
					color='default'
					{...register(`tracks.${trackIndex}.focus`)}>
					<div className='absolute -mt-[11px] z-50 flex gap-2 items-start	 min-w-80'>
						<p className='text-md'>Focus track</p>
						<Tooltip
							className='max-w-sm p-3'
							content={
								<div className='p-3 max-w-sm'>
									<p>
										Простой способ выделить лучшее из лучшего. Отметьте трек, к
										которому хотите привлечь внимание слушателя.
									</p>
									<ul className='mt-2'>
										<li className='flex gap-2 items-center'>
											<CheckBadgeIcon width={40} height={30} /> В релизах с
											количеством треков от 3 до 4 можно отметить 1 фокус-трек
										</li>
										<li className='flex gap-2 items-center'>
											<CheckBadgeIcon width={40} height={30} />В релизах с
											количеством треков от 5 до 10 можно отметить 2 фокус-трека
										</li>
										<li className='flex gap-2 items-center'>
											<CheckBadgeIcon width={40} height={30} />В релизах с
											количеством треков от 11 и более можно отметить 3
											фокус-трека
										</li>
									</ul>
									<p className='mt-2'>
										Обратите внимание, параметр нельзя использовать для синглов,
										макси-синглов и аудиокниг
									</p>
									<p className='mt-2'>Поддерживает только VK Музыка</p>
								</div>
							}>
							<InformationCircleIcon
								width={20}
								height={20}
								className='hover:text-indigo-400'
							/>
						</Tooltip>
					</div>
				</Checkbox>
			</div>
		</div>
	);
}
