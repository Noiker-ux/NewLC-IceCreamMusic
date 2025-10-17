'use client';

import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { Select, SelectItem } from '@heroui/select';
import { TrashIcon } from '@heroicons/react/24/outline';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import { TReleaseInsertForm } from 'shared/schema/release.schema';

const roles = ['Исполнитель', 'feat.'];

export default function PersonsAndRoles() {
	const { control, formState, getValues } =
		useFormContext<TReleaseInsertForm>();
	const { fields, append, remove } = useFieldArray({
		control,
		name: 'roles' as const,
		rules: { required: 'Добавьте хотя бы одну персону и приисвойте ему роль' },
	});

	return (
		<div className='p-5'>
			<p className='font-extrabold'>Персоны и роли</p>
			<p className='text-xs text-foreground-400'>
				Для Исполнителей, Соисполнителей (feat.), Remixer необходимо указать
				псевдоним артиста, группы или проекта.
			</p>

			<div>
				{fields.map((e, i) => (
					<div className='w-full flex py-2 gap-5 items-start' key={e.id}>
						<Controller
							control={control}
							name={`roles.${i}.person`}
							rules={{ required: 'Обязательное поле' }}
							render={({ field, fieldState }) => (
								<Input
									label={`Персона №${i + 1}`}
									labelPlacement={'outside'}
									placeholder={'Имя персоны'}
									type='text'
									radius='sm'
									isInvalid={!!fieldState.error}
									errorMessage={fieldState.error?.message}
									value={field.value}
									onChange={field.onChange}
								/>
							)}
						/>
						<Controller
							control={control}
							name={`roles.${i}.role`}
							rules={{ required: 'Обязательное поле' }}
							render={({ field, fieldState }) => (
								<Select
									label='Выберите роль'
									labelPlacement='outside'
									radius='sm'
									defaultSelectedKeys={['Исполнитель']}
									placeholder='Выберите роль'
									selectedKeys={field.value ? [field.value] : []}
									onSelectionChange={(e) => {
										field.onChange(e.anchorKey);
									}}
									isInvalid={!!fieldState.error}
									errorMessage={fieldState.error?.message}>
									{roles.map((r) => (
										<SelectItem key={r}>{r}</SelectItem>
									))}
								</Select>
							)}
						/>

						<Button
							color='default'
							size='sm'
							isIconOnly
							className='w-5 mt-[14px]'
							onPress={() => {
								remove(i);
							}}>
							<TrashIcon className='w-5 h-5 text-red-500' />
						</Button>
					</div>
				))}
				<div className='flex flex-col gap-2 mt-2 '>
					{getValues('roles') && getValues('roles').length > 0 ? (
						''
					) : (
						<span className='text-tiny text-danger'>
							Добавьте хотя бы одну персону и приисвойте ему роль
						</span>
					)}
					<Button
						className='w-fit'
						size='sm'
						onPress={() => append({ person: '', role: '' })}>
						Добавить персону
					</Button>
				</div>
			</div>
		</div>
	);
}
