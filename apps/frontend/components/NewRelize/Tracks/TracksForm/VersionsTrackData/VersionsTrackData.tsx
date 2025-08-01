import { Checkbox } from '@heroui/checkbox';
import { Tooltip } from '@heroui/tooltip';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { TReleaseInsertForm } from '@/schema/release.schema';
import { useFormContext } from 'react-hook-form';

export default function VersionsTrackData({
	trackIndex,
}: {
	trackIndex: number;
}) {
	const { register } = useFormContext<TReleaseInsertForm>();
	return (
		<div>
			<p className='font-extrabold'>Версия трека</p>
			<p className='max-w-xl mt-1 text-xs text-foreground-400'>
				Укажите версию трека, данный параметр участвует в системах рекомендаций
				площадок
			</p>
			<p className='max-w-xl mt-2 text-xs text-foreground-400'>
				Также редакции обращают внимание на версию, чтобы разместить трек в
				подходящий тематический плейлист
			</p>
			<div className='flex flex-col gap-5 mt-3'>
				<Checkbox
					color='default'
					{...register(`tracks.${trackIndex}.explicit`)}>
					<div className='absolute -mt-[11px] z-50 flex gap-2 items-start	 min-w-80'>
						<p className='text-md'>Explicit Content</p>
						<Tooltip
							className='max-w-sm p-3'
							content='Версия трека, содержащая ненормативную или потенциально оскорбительную лексику'>
							<InformationCircleIcon
								width={20}
								height={20}
								className='hover:text-indigo-400'
							/>
						</Tooltip>
					</div>
				</Checkbox>
				<Checkbox color='default' {...register(`tracks.${trackIndex}.live`)}>
					<div className='absolute -mt-[11px] z-50 flex gap-2 items-start	 min-w-80'>
						<p className='text-md'>Live</p>
						<Tooltip
							className='max-w-sm p-3'
							content='Запись живого выступления, если в названии трека вы уже указали Live, не выбирайте этот параметр'>
							<InformationCircleIcon
								width={20}
								height={20}
								className='hover:text-indigo-400'
							/>
						</Tooltip>
					</div>
				</Checkbox>
				<Checkbox color='default' {...register(`tracks.${trackIndex}.cover`)}>
					<div className='absolute -mt-[11px] z-50 flex gap-2 items-start	 min-w-80'>
						<p className='text-md'>Cover</p>
						<Tooltip
							className='max-w-sm p-3'
							content='Версия трека, исполненная другим артистом'>
							<InformationCircleIcon
								width={20}
								height={20}
								className='hover:text-indigo-400'
							/>
						</Tooltip>
					</div>
				</Checkbox>
				<Checkbox color='default' {...register(`tracks.${trackIndex}.remix`)}>
					<div className='absolute -mt-[11px] z-50 flex gap-2 items-start	 min-w-80'>
						<p className='text-md'>Remix</p>
						<Tooltip
							className='max-w-sm p-3'
							content='Альтернативная версия выпущенного ранее трека'>
							<InformationCircleIcon
								width={20}
								height={20}
								className='hover:text-indigo-400'
							/>
						</Tooltip>
					</div>
				</Checkbox>
				<Checkbox
					color='default'
					{...register(`tracks.${trackIndex}.instrumental`)}>
					<div className='absolute -mt-[11px] z-50 flex gap-2 items-start	 min-w-80'>
						<p className='text-md'>Instrumental</p>
						<Tooltip
							className='max-w-sm p-3'
							content='Версия трека без вокальной партии'>
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
