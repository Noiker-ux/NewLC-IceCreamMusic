'use client';

import { TReleaseInsertForm } from '@/schema/release.schema';
import { TrashIcon } from '@heroicons/react/24/outline';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { Select, SelectItem } from '@heroui/select';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import { motion } from 'motion/react';

export type TPersonsAndRolesTrack = {
	trackIndex: number;
};

const possibleRoles = ['Исполнитель', 'feat.', 'Автор музыки', 'Автор слов'];

export default function PersonsAndRolesTrack({
	trackIndex,
}: TPersonsAndRolesTrack) {
	const { control, register } = useFormContext<TReleaseInsertForm>();

	const {
		fields: roles,
		append: appendRole,
		remove: removeRole,
	} = useFieldArray({
		name: `tracks.${trackIndex}.roles`,
		control,
	});

	return (
		<div>
			<p className='font-extrabold'>Персоны и роли</p>
			<div className='max-w-lg flex flex-col gap-2'>
				<p className='text-xs text-foreground-400'>
					Для Исполнителей, Соисполнителей (feat.), Producer и Remixer
					необходимо указать псевдоним артиста, группы или проекта.
					<span className='text-red-600'>*</span>
				</p>
				<p className='text-xs text-foreground-400'>
					Для Авторов музыки и Авторов слов необходимо указать фактические имена
					и фамилии, не указывайте псевдонимы артистов, групп или проектов.
					<span className='text-red-600'>*</span>
				</p>
			</div>
			{roles.map((role, roleIndex) => (
				<motion.div
					className='w-full flex py-2 gap-5 items-center'
					key={role.id}>
					<Input
						label={`Персона №${roleIndex + 1}`}
						labelPlacement='outside'
						className='col-span-2'
						placeholder='Имя персоны'
						radius='sm'
						{...register(`tracks.${trackIndex}.roles.${roleIndex}.person`)}
					/>

					<Controller
						control={control}
						name={`tracks.${trackIndex}.roles.${roleIndex}.role`}
						render={({ field: { ref, value, onChange } }) => (
							<Select
								ref={ref}
								label='Выберите роль'
								labelPlacement='outside'
								radius='sm'
								className='col-span-2'
								placeholder='Выберите роль'
								selectedKeys={[value]}
								onChange={onChange}>
								{possibleRoles.map((r) => (
									<SelectItem key={r} textValue={r}>
										{r}
									</SelectItem>
								))}
							</Select>
						)}
					/>
					<Button
						color='default'
						size='sm'
						isIconOnly
						className='w-5 mt-[14px]'
						onPress={() => removeRole(roleIndex)}>
						<TrashIcon className='w-5 h-5 text-red-500' />
					</Button>
				</motion.div>
			))}

			<Button
				className='mt-2'
				size='sm'
				onPress={() => appendRole({ person: '', role: '' })}>
				Добавить персону
			</Button>
		</div>
	);
}
