import Image from 'next/image';
import { DatePicker } from '@heroui/date-picker';
import { I18nProvider } from '@react-aria/i18n';

export default function YandexMusic() {
	return (
		<div className='bg-zinc-900 rounded-xl p-5 w-full'>
			<Image
				src={'/assets/MusicServices/yandex.svg'}
				alt='Yandex Music'
				width={300}
				height={300}
			/>
			<I18nProvider locale='ru-RU'>
				<DatePicker
					className='max-w-[284px] mt-2'
					label='Скоро новый релиз'
					labelPlacement='outside'
				/>
			</I18nProvider>
			<p className='mt-2 max-w-lg text-sm text-foreground-400'>
				Функция, с помощью которой слушатель сохраняет в свою коллекцию релиз до
				его открытия на Яндекс Музыке. Вы можете подготовить аудиторию к выходу
				сингла или альбома, а также привлечь новых поклонников.
			</p>
		</div>
	);
}
