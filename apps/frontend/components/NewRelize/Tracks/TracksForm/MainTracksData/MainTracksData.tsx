import { TReleaseUpsert } from 'shared/schema/release.schema';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { Input } from '@heroui/input';
import { Tooltip } from '@heroui/tooltip';
import { useFormContext } from 'react-hook-form';

export default function MainTracksData({ trackIndex }: { trackIndex: number }) {
	const { register, formState } = useFormContext<TReleaseUpsert>();

	return (
		<div className='grid grid-cols-2 gap-5'>
			<Input
				label={
					<div className='flex items-center gap-1'>
						<p className='text-md'>Название трека</p>
						<Tooltip
							size='md'
							content={
								<div className='max-w-xs p-3'>
									<p>
										Наименование на языках, использующих кириллицу,, не должны
										быть представлены на транслите, если вы планируете отгрузку
										в AppleMusic
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
				placeholder='Введите название трека'
				type='text'
				radius='sm'
				{...register(`tracks.${trackIndex}.title`, {
					required: 'Поле обязательно для заполнения',
				})}
				isInvalid={
					!!formState.errors.tracks &&
					!!formState.errors.tracks[trackIndex]?.title
				}
				errorMessage={
					formState.errors.tracks &&
					formState.errors.tracks[trackIndex]?.title?.message?.toString()
				}
			/>

			<Input
				label={
					<div className='flex items-center gap-1'>
						<p className='text-md'>Подзаголовок</p>
						<Tooltip
							size='md'
							content={
								<div className='max-w-xs p-3'>
									<p>
										Дополнительное название например: Deluxe Edition, Remix,
										Acoustic Version. Если дополнительного названия нет,
										оставьте это поле пустым
									</p>
								</div>
							}>
							<InformationCircleIcon
								width={18}
								className='hover:text-indigo-400 '
							/>
						</Tooltip>
					</div>
				}
				labelPlacement={'outside'}
				placeholder='Введите подзаголовок релиза'
				type='text'
				radius='sm'
				{...register(`tracks.${trackIndex}.subtitle`)}
			/>
		</div>
	);
}
