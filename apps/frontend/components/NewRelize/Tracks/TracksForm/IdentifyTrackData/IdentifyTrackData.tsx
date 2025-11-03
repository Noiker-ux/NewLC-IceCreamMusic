'use client';
import { TReleaseUpsert } from 'shared/schema/release.schema';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { Input } from '@heroui/input';
import { Tooltip } from '@heroui/tooltip';
import { useFormContext } from 'react-hook-form';

export default function IdentifyTrackData({
	trackIndex,
}: {
	trackIndex: number;
}) {
	const { register } = useFormContext<TReleaseUpsert>();

	return (
		<div>
			<p className='font-extrabold'>Идентификация</p>
			<p className='max-w-xl text-xs text-foreground-400'>
				Укажите код, он необходим для точности в идентификации релиза на
				площадках и отчетности, если у вас нет ISRC, код будет сгенерирован
				автоматически
			</p>
			<div className='flex w-full gap-5 mt-3'>
				<Input
					label={
						<div className='flex items-center gap-1'>
							<p className='text-md'>ISRC</p>
							<Tooltip
								size='md'
								content={
									<div className='max-w-xs p-3'>
										<p>
											Международный уникальный код. Его наличие упрощает
											управление правами, когда видео используется в разных
											форматах, каналах распространения или продуктах. Если у
											Вас нет этого кода, мы присвоим его Вам самостоятельно.
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
					placeholder='Введите ISRC код'
					type='text'
					radius='sm'
					{...register(`tracks.${trackIndex}.isrc`)}
				/>
				<Input
					label={
						<div className='flex items-center gap-1'>
							<p className='text-md'>Код партнера</p>
							<Tooltip
								size='md'
								content={
									<div className='max-w-xs p-3'>
										<p>
											Ваш собственный код релиза. Укажите его для получения в
											финансовых отчетах
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
					placeholder='Введите код партнера'
					type='text'
					radius='sm'
					{...register(`tracks.${trackIndex}.partner_code`)}
				/>
			</div>
		</div>
	);
}
