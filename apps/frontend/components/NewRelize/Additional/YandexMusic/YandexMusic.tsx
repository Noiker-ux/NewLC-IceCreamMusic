import Image from 'next/image';
import { DatePicker } from '@heroui/date-picker';
import { I18nProvider } from '@react-aria/i18n';
import { TReleaseInsertForm } from '@/schema/release.schema';
import { Controller, useFormContext } from 'react-hook-form';
import dateISOFormatter from '@/utils/dateISOFormatter';
import { parseAbsoluteToLocal } from '@internationalized/date';

export default function YandexMusic() {
	const { control, formState } = useFormContext<TReleaseInsertForm>();

	return (
		<div className='bg-zinc-900 rounded-xl p-5 w-full'>
			<Image
				src={'/assets/MusicServices/yandex.svg'}
				alt='Yandex Music'
				width={300}
				height={300}
			/>

			<Controller
				control={control}
				name='yandexSoonNewRelease'
				rules={{ required: 'Обязательное поле' }}
				render={({ field }) => (
					<I18nProvider locale='ru-RU'>
						<DatePicker
							label='Скоро новый релиз'
							className='max-w-[284px] mt-2'
							labelPlacement='outside'
							hideTimeZone={true}
							minValue={parseAbsoluteToLocal(dateISOFormatter(new Date()))}
							granularity='day'
							showMonthAndYearPickers={true}
							isInvalid={!!formState.errors.yandexSoonNewRelease}
							errorMessage={formState.errors.yandexSoonNewRelease?.message?.toString()}
							{...field}
							onChange={(value) => {
								field.onChange(value?.toDate());
							}}
							value={
								field.value &&
								parseAbsoluteToLocal(dateISOFormatter(field.value))
							}
						/>
					</I18nProvider>
				)}
			/>
			<p className='mt-2 max-w-lg text-sm text-foreground-400'>
				Функция, с помощью которой слушатель сохраняет в свою коллекцию релиз до
				его открытия на Яндекс Музыке. Вы можете подготовить аудиторию к выходу
				сингла или альбома, а также привлечь новых поклонников.
			</p>
		</div>
	);
}
