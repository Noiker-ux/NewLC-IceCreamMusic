'use client';
import { TReleaseInsertForm } from '@/schema/release.schema';
import dateISOFormatter from '@/utils/dateISOFormatter';
import {
	CheckBadgeIcon,
	InformationCircleIcon,
} from '@heroicons/react/24/outline';
import { TimeInput } from '@heroui/date-input';
import { Checkbox, DatePicker } from '@heroui/react';
import { Tooltip } from '@heroui/tooltip';
import {
	parseZonedDateTime,
	parseAbsoluteToLocal,
} from '@internationalized/date';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { FaClock } from 'react-icons/fa';
import { I18nProvider } from '@react-aria/i18n';

export type TAdditionParametersTrackData = {
	trackIndex: number;
};

export default function AdditionParametersTrackData({
	trackIndex,
}: TAdditionParametersTrackData) {
	const { setValue, watch, register } = useFormContext<TReleaseInsertForm>();

	const previewStart = watch(`tracks.${trackIndex}.preview_start`);
	const instantgratificationW = watch(
		`tracks.${trackIndex}.instant_gratification`,
	);

	const [showDateInstantGratification, setShowDateInstantGratification] =
		useState<boolean>(instantgratificationW ? true : false);

	useEffect(() => {
		if (!showDateInstantGratification)
			setValue(`tracks.${trackIndex}.instant_gratification`, null);
	}, [setValue, showDateInstantGratification, trackIndex]);

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
					defaultValue={parseZonedDateTime(
						'2022-11-07T00:00[America/Los_Angeles]',
					)}
					granularity='minute'
					hourCycle={24}
					hideTimeZone
					value={parseZonedDateTime(
						`2022-11-07T${
							previewStart.length ? previewStart : '13:00'
						}[America/Los_Angeles]`,
					)}
					onChange={(e) => {
						setValue(
							`tracks.${trackIndex}.preview_start`,
							`${e?.hour.toString().length === 1 ? '0' + e?.hour : e?.hour}:${
								e?.minute.toString().length === 1 ? '0' + e?.minute : e?.minute
							}`,
						);
					}}
				/>
			</div>
			<div className='flex flex-col gap-5 mt-4'>
				<Checkbox
					size='md'
					color='default'
					className='relative'
					isSelected={showDateInstantGratification}
					onValueChange={setShowDateInstantGratification}>
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
									value ? value.toDate() : new Date(),
								);
							}}
							value={parseAbsoluteToLocal(
								dateISOFormatter(
									instantgratificationW ? instantgratificationW : new Date(),
								),
							)}
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
