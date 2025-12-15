'use client';
import { allGenres } from '@/data/allGenres';
import { isoLangs } from '@/data/allLanguage';
import { TReleaseUpsert } from 'shared/schema/release.schema';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { Input } from '@heroui/input';
import { Radio, RadioGroup } from '@heroui/radio';
import { Select, SelectItem } from '@heroui/select';
import { Tooltip } from '@heroui/tooltip';
import { Controller, useFormContext } from 'react-hook-form';

export default function WorkWithRelize() {
	const { control, formState } = useFormContext<TReleaseUpsert>();

	return (
		<div className='h-auto p-5 '>
			<p className='mb-1 font-extrabold text-lg'>Работа с релизом</p>
			<p className='text-sm'>Заполните общую информацю по релизу</p>

			<div className='mt-5 flex flex-col gap-4'>
				<div>
					<Controller
						control={control}
						name='language'
						rules={{ required: 'Выберите один язык из предложенных' }}
						render={({ field }) => (
							<Select
								labelPlacement={'outside'}
								placeholder='Выберите язык'
								className='w-full'
								label={
									<div className='flex items-center relative gap-1 right-0 z-50'>
										<p className='text-md'>Язык метаданных</p>
										<Tooltip
											size='md'
											className='absolute left-0 bg-red-700 w-10 h-10'
											content={
												<div className='max-w-xs p-3'>
													<p>
														Международный уникальный код. Его наличие упрощает
														управление правами, когда видео используется в
														разных форматах, каналах распространения или
														продуктах. Если у Вас нет этого кода, мы присвоим
														его Вам самостоятельно.
													</p>
												</div>
											}>
											<InformationCircleIcon
												width={18}
												className='hover:text-indigo-400'
											/>
										</Tooltip>
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

				<div className='flex gap-5'>
					<Controller
						control={control}
						name='title'
						rules={{
							required: 'Поле "Название релиза" является обязательным',
						}}
						render={({ field }) => (
							<Input
								label={
									<div className='flex items-center relative gap-1 right-0 z-50'>
										<p className='text-md'>Название релиза</p>
										<Tooltip
											size='md'
											content={
												<div className='max-w-xs p-3'>
													<p>
														Наименование на языках, использующих кириллицу, не
														должны быть представлены на странслите, если вы
														планируете отгрузку в AppleMusic
													</p>
												</div>
											}>
											<InformationCircleIcon
												width={18}
												className='hover:text-indigo-400'
											/>
										</Tooltip>
									</div>
								}
								labelPlacement={'outside'}
								size={'md'}
								type='text'
								isInvalid={!!formState.errors.title}
								placeholder='Введите название релиза'
								errorMessage={formState.errors.title?.message?.toString()}
								{...field}
							/>
						)}
					/>

					<Controller
						name='subtitle'
						control={control}
						render={({ field }) => (
							<Input
								label={
									<div className='flex items-center relative gap-1 right-0 z-50'>
										<p className='text-md'>Подзаголовок релиза</p>
										<Tooltip
											size='md'
											content={
												<div className='max-w-xs p-3'>
													<p>
														Дополнительное название, например: Deluxe Edition,
														Remix, Acoustic Version. Если дополнительного
														названия нет, оставьте поле пустым.
													</p>
												</div>
											}>
											<InformationCircleIcon
												width={18}
												className='hover:text-indigo-400'
											/>
										</Tooltip>
									</div>
								}
								labelPlacement={'outside'}
								placeholder='Введите подзаголовок релиза'
								type='text'
								radius='sm'
								{...field}
								value={field.value ?? ''}
							/>
						)}
					/>
				</div>
				<Controller
					name='genre'
					control={control}
					rules={{
						required: 'Выберите один жанр из предложенных',
					}}
					render={({ field }) => (
						<Select
							label='Жанр'
							labelPlacement={'outside'}
							placeholder='Выберите жанр'
							className='w-full'
							onSelectionChange={field.onChange}
							isInvalid={!!formState.errors.genre}
							selectedKeys={field.value ? [field.value] : []}
							errorMessage={formState.errors.genre?.message?.toString()}
							{...field}>
							{allGenres.map((genreItem) => (
								<SelectItem
									className='capitalize'
									key={genreItem.label}
									textValue={genreItem.label}>
									{genreItem.label}
								</SelectItem>
							))}
						</Select>
					)}
				/>

				<Controller
					name='type'
					control={control}
					rules={{
						required: 'Выберите тип релиза',
					}}
					render={({ field }) => (
						<RadioGroup
							orientation='horizontal'
							label='Тип релиза'
							onValueChange={field.onChange}
							isInvalid={!!formState.errors.type}
							value={field.value}
							errorMessage={formState.errors.type?.message?.toString()}>
							<Radio className='w-min ' value='single'>
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
							<Radio className='w-min ml-5' value='ep'>
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
							<Radio className='w-min ml-5' value='album'>
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
						</RadioGroup>
					)}
				/>
			</div>
		</div>
	);
}
