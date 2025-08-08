import { Input } from '@heroui/input';
import { useFormContext } from 'react-hook-form';
import { TPriorityRelease } from '../TPriorityRelease';
import { Textarea } from '@heroui/input';

export default function ArtistInfo() {
	const { register, formState } = useFormContext<TPriorityRelease>();

	return (
		<div className='bg-zinc-900 rounded-xl p-5 flex flex-col gap-4 w-full'>
			<p className='mb-1 font-extrabold text-lg'>Информация об Артисте</p>
			<div className='flex flex-col 1.5lg:flex-row gap-5 items-start'>
				<Input
					labelPlacement='outside'
					label={
						<div>
							Артист <span className='text-red-600'>*</span>
						</div>
					}
					description={
						<div className='mt-2 max-w-lg'>
							Пожалуйста, укажите Nickname артиста
						</div>
					}
					placeholder='Введите артиста'
					type='text'
					isClearable
					radius='sm'
					{...register('artist', {
						required: 'Поле обязательное для ввода',
					})}
					isInvalid={!!formState.errors.artist}
					errorMessage={formState.errors.artist?.message?.toString()}
				/>

				<Input
					labelPlacement='outside'
					label={
						<div>
							Страна артиста <span className='text-red-600'>*</span>
						</div>
					}
					placeholder='Введите страну'
					type='text'
					isClearable
					description={
						<div className='mt-2 max-w-lg'>
							Пожалуйста, укажите страну, в которой родился артист. Это позволит
							редакторам музыкальных сервисов более точно определить плейлист
							для поддержки
						</div>
					}
					radius='sm'
					{...register('artistCountryOfBitrth', {
						required: 'Поле обязательное для ввода',
					})}
					isInvalid={!!formState.errors.artistCountryOfBitrth}
					errorMessage={formState.errors.artistCountryOfBitrth?.message?.toString()}
				/>

				<Input
					labelPlacement='outside'
					label={
						<div>
							Фотография артиста <span className='text-red-600'>*</span>
						</div>
					}
					placeholder='Введите ссылку'
					type='text'
					isClearable
					description={
						<div className='mt-2 max-w-lg'>
							Ссылка на любой облачный сервис. Ссылка должна начинаться с
							https:// Предоставляя нам фотографию артиста вы подтверждаете, что
							получили согласие артиста на использование его изображения.
						</div>
					}
					radius='sm'
					{...register('photoArtistLink', {
						required: 'Поле обязательное для ввода',
					})}
					isInvalid={!!formState.errors.photoArtistLink}
					errorMessage={formState.errors.photoArtistLink?.message?.toString()}
				/>
			</div>
			<Textarea
				className='w-full'
				cols={130}
				label={
					<div>
						Описание релиза и артиста <span className='text-red-600'>*</span>
					</div>
				}
				minRows={10}
				labelPlacement='outside'
				placeholder='Описание релиза'
				description='Опишите релиз. Это может быть история создания, чему посвящён, настроение и т.д. Опишите артиста от третьего лица'
				{...register('descriptionRelizeAndArtist', {
					required: 'Поле обязательное для ввода',
				})}
				isInvalid={!!formState.errors.descriptionRelizeAndArtist}
				errorMessage={formState.errors.descriptionRelizeAndArtist?.message?.toString()}
			/>
		</div>
	);
}
