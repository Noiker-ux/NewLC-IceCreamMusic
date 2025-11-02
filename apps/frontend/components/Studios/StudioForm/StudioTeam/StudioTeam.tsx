import { TrashIcon } from '@heroicons/react/24/outline';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { useFieldArray, useFormContext } from 'react-hook-form';
import Image from 'next/image';
import { useCallback } from 'react';
import { TStudio } from 'shared/schema/studio.schema';
import { InputOtp } from '@heroui/react';

export default function StudioTeam() {
	const methods = useFormContext<TStudio>();

	const { fields, append, remove } = useFieldArray({
		control: methods.control,
		name: 'team' as const,
		rules: { required: 'Добавьте хотя бы одну персону' },
	});

	const handleFilePhotoChange = (i: number, newFiles: File[]) => {
		const newFile = newFiles.at(0);
		if (!!newFile) methods.setValue(`team.${i}.photo`, newFile);
	};

	return (
		<>
			<div className='flex flex-row gap-5 flex-wrap w-full'>
				{fields.map((photo, i) => {
					const photoFile = methods.watch(`team.${i}.photo`);

					return (
						<div
							key={i}
							className='flex flex-col gap-1 justify-center w-1/4 bg-zinc-900 p-3 rounded-md'>
							<div className='relative'>
								<Image
									src={
										!(photoFile instanceof File)
											? '/assets/NoPicture.jpg'
											: URL.createObjectURL(photoFile)
									}
									alt='Фотография персонажа'
									width={100}
									height={100}
									className={'w-full aspect-square'}
								/>
								<Button
									color='danger'
									size='sm'
									isIconOnly
									className='w-5  absolute top-2 right-2'
									onPress={() => {
										remove(i);
									}}>
									<TrashIcon className='w-5 h-5' />
								</Button>
								<div className='flex flex-col gap-5 mt-5'>
									<Input
										label='Введите фамилию и имя'
										labelPlacement='outside'
										placeholder='Фамилия и имя'
										radius='sm'
										type='text'
										{...methods.register(`team.${i}.name`)}
									/>
									<Input
										label='Введите место работы'
										labelPlacement='outside'
										placeholder='Место работы'
										radius='sm'
										type='text'
										{...methods.register(`team.${i}.place`)}
									/>
									<Input
										label='Введите должность'
										labelPlacement='outside'
										placeholder='Должность'
										radius='sm'
										className='mb-10'
										type='text'
										{...methods.register(`team.${i}.position`)}
									/>
								</div>
							</div>

							<Input
								label='Введите наименование статистического параметра'
								labelPlacement='outside'
								placeholder='Статистический параметр'
								radius='sm'
								type='file'
								onChange={(e) =>
									e.target.files &&
									handleFilePhotoChange(i, Array.from(e.target.files))
								}
							/>
						</div>
					);
				})}
			</div>
			<div className='flex flex-col gap-2 mt-2 '>
				{methods.getValues('team') && methods.getValues('team').length > 0 ? (
					''
				) : (
					<span className='text-tiny text-danger'>
						Добавьте хотя бы одну персону
					</span>
				)}
			</div>
			<Button
				className='w-fit mt-2 mx-auto'
				onPress={() =>
					append({ photo: {} as File, name: '', position: '', place: '' })
				}>
				Добавить персону
			</Button>
		</>
	);
}
