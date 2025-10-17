'use client';
import { TReleaseInsertForm } from 'shared/schema/release.schema';
import { Input } from '@heroui/input';
import { Controller, useFormContext } from 'react-hook-form';

export default function Identify() {
	const { control, formState } = useFormContext<TReleaseInsertForm>();
	return (
		<div className='bg-zinc-900 h-min rounded-xl p-5'>
			<p className='font-extrabold'>Идентификация</p>
			<p className='text-xs text-foreground-400'>
				Укажите код, он необходим для точности в идентификации релиза на
				площадках и отчетности, если у вас нет UPC, код будет сгенерирован
				автоматически
			</p>
			<Controller
				control={control}
				name='upc'
				render={({ field }) => (
					<Input
						label='UPC'
						className='pt-3'
						labelPlacement={'outside'}
						placeholder='Введите UPC код'
						type='text'
						radius='sm'
						isInvalid={!!formState.errors.upc}
						errorMessage={formState.errors.upc?.message?.toString()}
						{...field}
						value={field.value ?? ''}
					/>
				)}
			/>
		</div>
	);
}
