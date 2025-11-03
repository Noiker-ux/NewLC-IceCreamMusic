import { TReleaseUpsert } from 'shared/schema/release.schema';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { Input } from '@heroui/input';
import { Tooltip } from '@heroui/tooltip';
import { useFormContext } from 'react-hook-form';
import { BsPCircleFill } from 'react-icons/bs';
import { FaCopyright } from 'react-icons/fa6';

export type TCopyRightTrackData = {
	trackIndex: number;
};

export default function CopyRightTrackData({
	trackIndex,
}: TCopyRightTrackData) {
	const { register } = useFormContext<TReleaseUpsert>();

	return (
		<div>
			<p className='font-extrabold'>Права</p>
			<div className='max-w-lg flex flex-col gap-2'>
				<p className='text-xs text-foreground-400'>
					Укажите долю, если авторов несколько, укажите сумму долей
				</p>
				<p className='text-xs text-foreground-400'>
					Авторское вознаграждение выплачивается в соответствии с указанной
					долей и условиям договора
				</p>
			</div>
			<div className='flex gap-5 mt-2'>
				<Input
					label={
						<div className='flex items-center gap-1 '>
							<p className='text-md'>Авторские права</p>
							<Tooltip
								size='md'
								content={
									<div className='max-w-xs p-3'>
										<p>
											Укажите долю. Если авторов несколько, укажите сумму
											долеййй
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
					placeholder='Введите долю авторских прав'
					type='number'
					step={0.01}
					max={100}
					min={0}
					startContent={<FaCopyright size={20} />}
					radius='sm'
					{...register(`tracks.${trackIndex}.author_rights`)}
				/>
				<Input
					label={
						<div className='flex items-center gap-1'>
							<p className='text-md'>Смежные права</p>
							<Tooltip
								size='md'
								content={
									<div className='max-w-xs p-3'>
										<p>
											Релиз может быть доставлен на площадки только при наличии
											100%
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
					isDisabled
					labelPlacement={'outside'}
					defaultValue='100'
					startContent={<BsPCircleFill size={20} />}
					placeholder='Введите долю смежных прав'
					radius='sm'
				/>
			</div>
		</div>
	);
}
