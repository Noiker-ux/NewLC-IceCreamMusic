import { TrashIcon } from '@heroicons/react/24/outline';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { TStudioUpsertForm } from 'shared/schema/studio.schema';

export default function StudioStats() {
	const methods = useFormContext<TStudioUpsertForm>();

	const { fields, append, remove } = useFieldArray({
		control: methods.control,
		name: 'stats',
		rules: {
			required:
				'Добавьте хотя бы одну статистическую информацию и приисвойте ей значение',
		},
	});
	return (
		<>
			<div className='flex flex-col gap-3 '>
				{fields.map((stat, i) => {
					return (
						<div
							key={i}
							className='flex gap-5 justify-center bg-zinc-900 p-5 rounded-lg'>
							<Input
								label='Введите наименование статистического параметра'
								labelPlacement='outside'
								placeholder='Статистический параметр'
								radius='sm'
								isRequired
								type='text'
								{...methods.register(`stats.${i}.name`)}
							/>{' '}
							<Input
								label='Введите значение статистического параметра'
								labelPlacement='outside'
								placeholder='Значение'
								radius='sm'
								isRequired
								type='text'
								{...methods.register(`stats.${i}.value`)}
							/>
							<Button
								color='danger'
								size='sm'
								isIconOnly
								className='w-5 mt-[25px]'
								onPress={() => {
									remove(i);
								}}>
								<TrashIcon className='w-5 h-5' />
							</Button>
						</div>
					);
				})}
			</div>
			<div className='flex flex-col gap-2 mt-2 '>
				{methods.formState.errors.stats && (
					<span className='text-tiny text-danger'>
						{methods.formState.errors.stats.message}
					</span>
				)}
			</div>
			<Button
				className='w-fit mt-2 mx-auto'
				onPress={() => append({ name: '', value: '' })}>
				Добавить статистические данные
			</Button>
		</>
	);
}
