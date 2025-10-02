import { DatePicker } from '@heroui/react';
import { parseAbsoluteToLocal } from '@internationalized/date';
import { Controller, useFormContext } from 'react-hook-form';
import dateISOFormatter from '@/utils/dateISOFormatter';
import { I18nProvider } from '@react-aria/i18n';
import { TReleaseInsertForm } from '@/schema/release.schema';

export default function MainDates() {
	const { control, formState, register, getValues } =
		useFormContext<TReleaseInsertForm>();
	return (
		<div className='p-5'>
			<p className='font-extrabold'>Основные даты релиза</p>
			<div className='flex gap-5 mt-3'>
				<Controller
					control={control}
					name='preorderDate'
					rules={{ required: 'Обязательное поле' }}
					render={({ field }) => (
						<I18nProvider locale='ru-RU'>
							<DatePicker
								description='Дата для предзаказа альбома на iTunes и Apple Music. Если релиз выпускается без предзаказа, укажите дату старта'
								label='Дата предзаказа'
								labelPlacement={'outside'}
								granularity='day'
								showMonthAndYearPickers={true}
								hideTimeZone={true}
								{...field}
								onChange={(value) => {
									if (value) {
										if (
											dateISOFormatter(value.toDate()).split('-')[0].length ===
											4
										) {
											field.onChange(new Date(value.toDate()));
										}
									}
								}}
								value={
									field.value &&
									parseAbsoluteToLocal(dateISOFormatter(field.value))
								}
							/>
						</I18nProvider>
					)}
				/>

				<Controller
					control={control}
					name='startDate'
					rules={{ required: 'Обязательное поле' }}
					render={({ field }) => (
						<I18nProvider locale='ru-RU'>
							<DatePicker
								description='Запланированная дата открытия релиза на площадках. Именно в эту дату релиз должен открыться на площадках'
								label='Дата старта'
								labelPlacement={'outside'}
								hideTimeZone={true}
								minValue={parseAbsoluteToLocal(dateISOFormatter(new Date()))}
								granularity='day'
								showMonthAndYearPickers={true}
								isInvalid={!!formState.errors.startDate}
								errorMessage={formState.errors.startDate?.message?.toString()}
								{...field}
								onChange={(value) => {
									if (value) {
										if (
											dateISOFormatter(value.toDate()).split('-')[0].length ===
											4
										) {
											field.onChange(new Date(value.toDate()));
										}
									}
								}}
								value={
									field.value &&
									parseAbsoluteToLocal(dateISOFormatter(field.value))
								}
							/>
						</I18nProvider>
					)}
				/>
				<Controller
					control={control}
					name='releaseDate'
					rules={{ required: 'Обязательное поле' }}
					render={({ field }) => (
						<I18nProvider locale='ru-RU'>
							<DatePicker
								description='Официальная дата публикации релиза. Именно эта дата отображается внутри релиза на площадках'
								label='Дата релиза'
								labelPlacement={'outside'}
								hideTimeZone={true}
								minValue={parseAbsoluteToLocal(dateISOFormatter(new Date()))}
								granularity='day'
								showMonthAndYearPickers={true}
								isInvalid={!!formState.errors.releaseDate}
								errorMessage={formState.errors.releaseDate?.message?.toString()}
								{...field}
								onChange={(value) => {
									if (value) {
										if (
											dateISOFormatter(value.toDate()).split('-')[0].length ===
											4
										) {
											field.onChange(new Date(value.toDate()));
										}
									}
								}}
								value={
									field.value &&
									parseAbsoluteToLocal(dateISOFormatter(field.value))
								}
							/>
						</I18nProvider>
					)}
				/>
			</div>
		</div>
	);
}
