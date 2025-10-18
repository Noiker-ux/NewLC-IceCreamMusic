import { TrashIcon } from '@heroicons/react/24/outline';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { useFieldArray, useFormContext } from 'react-hook-form';
import Image from 'next/image';
import { useCallback } from 'react';

export default function StudioPhotos() {
	const methods = useFormContext();

	const { fields, append, remove } = useFieldArray({
		control: methods.control,
		name: 'photos' as const,
		rules: { required: 'Добавьте хотя бы одну фотографию студии' },
	});

	const handleFilePhotoChange = (i: number) => {
		return function updateValue(newFiles: File[]) {
			methods.setValue(`photos.${i}.photo`, newFiles.at(0));
		};
	};

	return (
		<>
			<div className='flex flex-col gap-3'>
				{fields.map((photo, i) => {
					const photoFileWatch = methods.watch(`photos.${i}.photo`);
					return (
						<div key={i} className='flex flex-col gap-1 justify-center w-1/4'>
							<div className='relative'>
								<Image
									src={
										!(photoFileWatch instanceof File)
											? '/assets/NoPicture.jpg'
											: URL.createObjectURL(photoFileWatch)
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
								label='Введите наименование статистического параметра'
								labelPlacement='outside'
								placeholder='Статистический параметр'
								radius='sm'
								type='file'
								{...methods.register(`photos.${i}.photo`)}
								onChange={(e) =>
									e.target.files &&
									handleFilePhotoChange(i)(Array.from(e.target.files))
								}
							/>
						</div>
					);
				})}
			</div>
			<div className='flex flex-col gap-2 mt-2 '>
				{methods.getValues('photos') &&
				methods.getValues('photos').length > 0 ? (
					''
				) : (
					<span className='text-tiny text-danger'>
						Добавьте хотя бы одну фотографию студии
					</span>
				)}
			</div>
			<Button
				className='w-fit mt-2 mx-auto'
				onPress={() => append({ photo: null })}>
				Добавить фотографию
			</Button>
		</>
	);
}
