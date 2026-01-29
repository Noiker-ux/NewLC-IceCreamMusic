import { TrashIcon } from '@heroicons/react/24/outline';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { useFieldArray, useFormContext } from 'react-hook-form';
import Image from 'next/image';
import { useCallback } from 'react';
import { TStudio, TStudioUpsertForm } from 'shared/schema/studio.schema';

export default function StudioPhotos() {
	const methods = useFormContext<TStudioUpsertForm>();

	const { fields, append, remove } = useFieldArray({
		control: methods.control,
		name: 'photos' as const,
		rules: { required: 'Добавьте хотя бы одну фотографию студии' },
	});

	const handleFilePhotoChange = (i: number, newFiles: File[]) => {
		const newFile = newFiles.at(0);

		if (!!newFile) methods.setValue(`photos.${i}.url`, newFile);
	};

	return (
		<>
			<div className='flex flex-row gap-5 flex-wrap'>
				{fields.map((photo, i) => {
					const photoFile = methods.watch(`photos.${i}.url`);

					return (
						<div
							key={i}
							className='flex flex-col gap-1 justify-center w-1/4 bg-zinc-900 p-3 rounded-xl'>
							<div className='relative'>
								<Image
									src={
										!(photoFile instanceof File)
											? '/assets/NoPicture.jpg'
											: URL.createObjectURL(photoFile)
									}
									alt='Фотография студии'
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
							</div>

							<Input
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
				{methods.formState.errors.photos && (
					<span className='text-tiny text-danger'>
						{methods.formState.errors.photos.message}
					</span>
				)}
			</div>
			<Button
				className='w-fit mt-2 mx-auto'
				onPress={() => append({ url: {} as File, name: '' })}>
				Добавить фотографию
			</Button>
		</>
	);
}
