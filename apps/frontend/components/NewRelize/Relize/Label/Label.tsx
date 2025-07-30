'use client';
import { Checkbox } from '@heroui/checkbox';
import { Input } from '@heroui/input';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { Controller, useFormContext } from 'react-hook-form';
import { Tooltip } from '@heroui/tooltip';
import { useState } from 'react';

export default function Label() {
	const { control, formState, setValue, getValues, watch } = useFormContext();

	const [labelChange, setLabelChange] = useState<boolean>(
		() => getValues('labelName') !== 'ICECREAMMUSIC',
	);

	const labelName = watch('labelName');

	return (
		<div className='bg-zinc-900 h-min rounded-xl p-5'>
			<p className='font-extrabold'>Лейбл</p>
			<p className='text-xs text-foreground-400'>
				Укажите наименование лейбла, данная информация будет отображена на
				площадках.
			</p>

			<Checkbox
				className='mt-1'
				color='default'
				name={'labelChange'}
				size='sm'
				onValueChange={(value) => {
					if (!value) setValue('labelName', 'ICECREAMMUSIC');
					setLabelChange((val) => !val);
				}}
				isSelected={labelChange}>
				<div className='flex gap-2 relative z-20'>
					Изменить лейбл {JSON.stringify(labelName)}
					<Tooltip
						size='md'
						content={
							<div className='max-w-xs p-3'>
								<p className='mt-1'>Стоимость изменения лейбла:</p>
								<ul>
									<li className='mt-1'>* без подписки: 500р</li>
									<li className='mt-1'>* с подпиской уровня Стандарт: 500р</li>
									<li className='mt-1'>
										* с подпиской уровня Профессионал: 500р
									</li>
									<li className='mt-1'>* с подпиской уровня Энтерпрайз: 0р</li>
								</ul>
							</div>
						}>
						<InformationCircleIcon
							width={18}
							className='hover:text-indigo-400'
						/>
					</Tooltip>
				</div>
			</Checkbox>

			{labelChange && (
				<p className='text-foreground-400 text-xs mt-2'>
					Имейте ввиду, что смена лейбла приведет к увелечению цены за релиз
				</p>
			)}
			<div className='pt-3'>
				<Controller
					name='labelName'
					control={control}
					defaultValue={'ICECREAMMUSIC'}
					rules={{ required: 'Полей "Лейбл" является обязательным' }}
					render={({ field }) => (
						<Input
							label='Лейбл'
							labelPlacement={'outside'}
							placeholder='Введите Лейбл'
							type='text'
							radius='sm'
							isDisabled={!labelChange}
							description='Выпуская релиз под нашим лейблом вы получаете плюшки, и на всех площадках вы будете указаны как член лейбла ICECREAMMUSIC'
							isInvalid={!!formState.errors.label}
							errorMessage={formState.errors.label?.message?.toString()}
							{...field}
						/>
					)}
				/>
			</div>
		</div>
	);
}
