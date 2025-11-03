import { Textarea } from '@heroui/react';
import { Tooltip } from '@heroui/tooltip';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { TReleaseUpsert } from 'shared/schema/release.schema';
import { useFormContext } from 'react-hook-form';
export default function TextTrack({ trackIndex }: { trackIndex: number }) {
	const { register } = useFormContext<TReleaseUpsert>();
	return (
		<div>
			<p className='font-bold'>Текст трека</p>
			<p className='max-w-xl mt-1 text-sm flex text-foreground-400'>
				Ознакомьтесь с рекомендациями по подготовке и загрузке этого типа
				контента.
				<Tooltip
					content={
						<div className='max-w-xs p-3'>
							<p>s</p>
						</div>
					}>
					<InformationCircleIcon width={18} className='hover:text-indigo-400' />
				</Tooltip>
			</p>
			<Textarea
				className='w-1/2 mt-2 '
				placeholder='Введите текст трека'
				{...register(`tracks.${trackIndex}.text`)}
			/>
		</div>
	);
}
