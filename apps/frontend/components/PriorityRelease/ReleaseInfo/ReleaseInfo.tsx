import { Input } from '@heroui/input';
import { Controller, useFormContext } from 'react-hook-form';
import { TPriorityRelease } from '../TPriorityRelease';
import { I18nProvider } from '@react-aria/i18n';
import { DatePicker } from '@heroui/date-picker';
import { parseAbsoluteToLocal } from '@internationalized/date';
import dateISOFormatter from '@/utils/dateISOFormatter';
import { Select, SelectItem } from '@heroui/select';
import { allGenres } from '@/data/allGenres';
import { Radio, RadioGroup } from '@heroui/radio';
import { Tooltip } from '@heroui/tooltip';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { isoLangs } from '@/data/allLanguage';

export default function ReleaseInfo() {
	const { register, formState, control } = useFormContext<TPriorityRelease>();

	return (
		<div className='bg-zinc-900 rounded-xl p-5 flex flex-col gap-4 w-full'>
			<p className='mb-1 font-extrabold text-lg'>Информация о релизе и треке</p>
			<div className='flex flex-col 1.5lg:flex-row items-start gap-5'>
				<Input
					labelPlacement='outside'
					label={
						<div>
							Название релиза <span className='text-red-600'>*</span>
						</div>
					}
					placeholder='Введите название релиза'
					type='text'
					radius='sm'
					{...register('relize_title', {
						required: 'Поле обязательное для ввода',
					})}
					isInvalid={!!formState.errors.relize_title}
					errorMessage={formState.errors.relize_title?.message?.toString()}
				/>
				<Controller
					control={control}
					name='language'
					rules={{ required: 'Выберите один язык из предложенных' }}
					render={({ field }) => (
						<Select
							labelPlacement={'outside'}
							placeholder='Выберите язык'
							className='w-full'
							radius='sm'
							label={
								<div className='flex items-center relative gap-1 right-0 z-50'>
									<p className='text-md'>
										Язык <span className='text-red-600'>*</span>
									</p>
								</div>
							}
							isInvalid={!!formState.errors.language}
							selectedKeys={field.value ? [field.value] : []}
							onSelectionChange={field.onChange}
							errorMessage={formState.errors.language?.message?.toString()}
							{...field}>
							{isoLangs.map((languageItem) => (
								<SelectItem
									className='capitalize'
									key={languageItem.name}
									textValue={languageItem.name}>
									{languageItem.nativeName}
								</SelectItem>
							))}
						</Select>
					)}
				/>
			</div>
			<div className='flex flex-col 1.5lg:flex-row gap-5 items-start'>
				<Controller
					control={control}
					name='relize_date'
					rules={{ required: 'Обязательное поле' }}
					render={({ field }) => (
						<I18nProvider locale='ru-RU'>
							<DatePicker
								label={
									<div>
										Дата релиза <span className='text-red-600'>*</span>
									</div>
								}
								labelPlacement={'outside'}
								hideTimeZone={true}
								granularity='day'
								radius='sm'
								showMonthAndYearPickers={true}
								isInvalid={!!formState.errors.relize_date}
								errorMessage={formState.errors.relize_date?.message?.toString()}
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
				<Controller
					name='genre'
					control={control}
					rules={{
						required: 'Выберите один жанр из предложенных',
					}}
					render={({ field }) => (
						<Select
							label={
								<div>
									Жанр <span className='text-red-600'>*</span>
								</div>
							}
							labelPlacement={'outside'}
							placeholder='Выберите жанр'
							radius='sm'
							className='w-full'
							onSelectionChange={field.onChange}
							isInvalid={!!formState.errors.genre}
							selectedKeys={field.value ? [field.value] : []}
							errorMessage={formState.errors.genre?.message?.toString()}
							{...field}>
							{allGenres.map((genreItem) => (
								<SelectItem
									className='capitalize'
									key={genreItem.value}
									textValue={genreItem.label}>
									{genreItem.label}
								</SelectItem>
							))}
						</Select>
					)}
				/>
			</div>
			<Controller
				name='format'
				control={control}
				rules={{
					required: 'Выберите тип релиза',
				}}
				render={({ field }) => (
					<RadioGroup
						orientation='horizontal'
						label={
							<div>
								Тип релиза <span className='text-red-600'>*</span>
							</div>
						}
						onValueChange={field.onChange}
						isInvalid={!!formState.errors.format}
						value={field.value}
						errorMessage={formState.errors.format?.message?.toString()}>
						<Radio className='' value='single'>
							<div className='flex items-center gap-1 relative z-20'>
								<p className='text-md'> Single</p>
								<Tooltip
									size='md'
									content={
										<div className='max-w-xs p-3'>
											<p>Single - 1 трек</p>
										</div>
									}>
									<InformationCircleIcon
										width={18}
										className='hover:text-indigo-400'
									/>
								</Tooltip>
							</div>
						</Radio>
						<Radio className='ml-5' value='EP'>
							<div className='flex items-center gap-1 relative z-20'>
								<p className='text-md'> EP</p>
								<Tooltip
									size='md'
									content={
										<div className='max-w-xs p-3'>
											<p>EP - от 3 до 4 трека</p>
										</div>
									}>
									<InformationCircleIcon
										width={18}
										className='hover:text-indigo-400'
									/>
								</Tooltip>
							</div>
						</Radio>
						<Radio className='ml-5' value='Album'>
							<div className='flex items-center gap-1 relative z-20'>
								<p className='text-md'> Album</p>
								<Tooltip
									size='md'
									content={
										<div className='max-w-xs p-3'>
											<p>Album - 5 и более треков</p>
										</div>
									}>
									<InformationCircleIcon
										width={18}
										className='hover:text-indigo-400'
									/>
								</Tooltip>
							</div>
						</Radio>
						<Radio className=' xl:ml-5 w-full' value='Music Video'>
							<div className='flex items-center gap-1 relative z-20'>
								<p className='text-md'>Music Video</p>
								<Tooltip
									size='md'
									content={
										<div className='max-w-xs p-3'>
											<p>
												Music Video — короткий кино- или видеофрагмент,
												сопровождающий музыкальную композицию.
											</p>
										</div>
									}>
									<InformationCircleIcon
										width={18}
										className='hover:text-indigo-400'
									/>
								</Tooltip>
							</div>
						</Radio>
					</RadioGroup>
				)}
			/>
			<div className='flex flex-col 1.5lg:flex-row gap-5 items-start'>
				<Input
					label={
						<div className='flex gap-1'>
							UPC
							<Tooltip
								size='md'
								content={
									<div className='max-w-xs p-3'>
										<p>UPC - код релиза</p>
									</div>
								}>
								<InformationCircleIcon
									width={18}
									className='hover:text-indigo-400'
								/>
							</Tooltip>
							<span className='text-red-600'>*</span>
						</div>
					}
					className='pt-3'
					labelPlacement={'outside'}
					placeholder='Введите UPC код'
					type='text'
					radius='sm'
					{...register('UPC', { required: 'Поле обязательное для ввода' })}
					isInvalid={!!formState.errors.UPC}
					errorMessage={formState.errors.UPC?.message?.toString()}
				/>
				<Input
					label={
						<div>
							Название ключевого трека <span className='text-red-600'>*</span>
						</div>
					}
					className='pt-3'
					labelPlacement={'outside'}
					placeholder='Введите название ключевого трека'
					type='text'
					radius='sm'
					{...register('mainTrackTitle', {
						required: 'Поле обязательное для ввода',
					})}
					isInvalid={!!formState.errors.mainTrackTitle}
					errorMessage={formState.errors.mainTrackTitle?.message?.toString()}
				/>
			</div>

			<Input
				label={
					<div>
						Лейбл <span className='text-red-600'>*</span>
					</div>
				}
				labelPlacement={'outside'}
				placeholder='Введите Лейбл'
				type='text'
				radius='sm'
				description='Выпуская релиз под нашим лейблом вы получаете плюшки, и на всех площадках вы будете указаны как член лейбла ICECREAMMUSIC'
				{...register('label', { required: 'Поле обязательное для ввода' })}
				isInvalid={!!formState.errors.label}
				errorMessage={formState.errors.label?.message?.toString()}
			/>
			<div className='flex flex-col 1.5lg:flex-row gap-5 items-start'>
				<Input
					label={
						<div>
							Ссылка на предпросмотр клипа{' '}
							<span className='text-red-600'>*</span>
						</div>
					}
					labelPlacement={'outside'}
					placeholder='Введите ссылку'
					description='Ссылка на любой облачный сервис. Ссылка должна начинаться с https://'
					type='text'
					radius='sm'
					{...register('videoLink', {
						required: 'Поле обязательное для ввода',
					})}
					isInvalid={!!formState.errors.videoLink}
					errorMessage={formState.errors.videoLink?.message?.toString()}
				/>
				<Input
					label={
						<div>
							Cсылка на прослушивание релиза{' '}
							<span className='text-red-600'>*</span>
						</div>
					}
					labelPlacement={'outside'}
					placeholder='Введите ссылку'
					type='text'
					radius='sm'
					description='Ссылка на любой облачный сервис. Качества mp3 достаточно. Ссылка должна начинаться с https://'
					{...register('linkRelize', {
						required: 'Поле обязательное для ввода',
					})}
					isInvalid={!!formState.errors.linkRelize}
					errorMessage={formState.errors.linkRelize?.message?.toString()}
				/>
			</div>
		</div>
	);
}
