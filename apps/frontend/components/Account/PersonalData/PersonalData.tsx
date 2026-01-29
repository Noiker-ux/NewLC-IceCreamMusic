'use client';
import {
	profileFormSchema,
	TProfileFormSchema,
} from 'shared/schema/profile.schema';
import { CameraIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { Icon } from '@iconify/react';
import Image from 'next/image';
import { useCallback, useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { TGetMeResponse } from 'sdk/lib/user/user.controller';
import { actionUpdatePersonalData } from './actionUpdatePersonalData';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast, Toaster } from 'sonner';
export default function PersonalDataProps({
	PersonalDataProps,
}: {
	PersonalDataProps: TGetMeResponse['data'];
}) {
	const { avatar, birthDate, name, id, ...userData } = PersonalDataProps;
	const router = useRouter();
	const methods = useForm<TProfileFormSchema>({
		resolver: zodResolver(profileFormSchema),
		defaultValues: {
			...userData,
		},
	});

	const onSubmit: SubmitHandler<TProfileFormSchema> = useCallback(
		async (data) => {
			const resultPromise = actionUpdatePersonalData({
				...data,
				avatar: data.avatar?.name.split('.').at(-1),
			});

			toast.promise(resultPromise, {
				loading: 'Загрузка...',
				success: (responce) => {
					if (!responce.success) {
						return {
							message: responce.error,
							className: '!bg-red-300 !border-red-600 !text-red-800',
							duration: 500,
						};
					}

					router.refresh();

					return {
						message: 'Данные профиля успешно обновлены',
						className: '!bg-green-300 !border-green-600 !text-green-800',
						duration: 500,
					};
				},
				error: (responce) => {
					return {
						message: `${responce.message}`,
						className: '!bg-red-300 !border-red-600 !text-red-800',
					};
				},
			});
			const result = await resultPromise;

			if (data.avatar && result.success && result.data) {
				const loadingToast = toast.loading('Загрузка файла аватара');

				const totalBytes = data.avatar.size;

				let uploaded = 0;

				const progressTrackingStream = new TransformStream({
					transform(chunk, controller) {
						controller.enqueue(chunk);
						uploaded += chunk.byteLength;

						toast(`${Math.round(uploaded / totalBytes)}%`, {
							id: loadingToast,
						});
					},
					flush() {
						toast.success(`${Math.round(uploaded / totalBytes)}%`, {
							id: loadingToast,
						});
					},
				});

				await fetch(result.data.avatar, {
					method: 'PUT',
					body: data.avatar.stream().pipeThrough(progressTrackingStream),
					duplex: 'half',
					headers: {
						'Content-Type': 'application/octet-stream',
						'Content-Length': String(totalBytes),
					},
				} as RequestInit);
			}
		},
		[router],
	);

	const refAvatar = useRef<HTMLInputElement>(null);

	const handleClickAvatar = () => {
		if (refAvatar.current) {
			refAvatar.current.click();
		}
	};

	const avatarExists = !!avatar;

	const formAvatar = methods.watch('avatar');

	const avatarUrl = avatar?.includes('https://')
		? avatar
		: `${process.env.NEXT_PUBLIC_S3_URL}/avatars/${id}.${avatar}`;

	const handleFileChange = useCallback(
		(newFiles: File[]) => {
			methods.setValue('avatar', newFiles.at(0));
		},
		[methods],
	);

	return (
		<div className='grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8'>
			<div>
				<Toaster />
				<h2 className='text-base/7 font-semibold text-white flex gap-3 items-center'>
					<UserGroupIcon className='w-9' />
					Персональные данные
				</h2>
				<p className='mt-1 text-sm/6 text-gray-400'>
					Используйте постоянный адрес, по которому вы можете получать
					электронные письма и письма об уведомлениях.
				</p>
			</div>

			<form className='md:col-span-2' onSubmit={methods.handleSubmit(onSubmit)}>
				<div className='grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6'>
					<div className='col-span-full flex items-center gap-x-8'>
						{!formAvatar && avatarExists && (
							<Image
								width={96}
								height={96}
								alt='Превью аватара'
								src={avatarUrl}
								className='size-24 flex-none rounded-lg bg-gray-800 object-cover'
							/>
						)}
						{formAvatar && (
							<Image
								width={96}
								height={96}
								alt='Превью аватара'
								src={URL.createObjectURL(formAvatar)}
								className='size-24 flex-none rounded-lg bg-gray-800 object-cover'
							/>
						)}
						{!formAvatar && !avatarExists && (
							<div className='w-12'>
								<Icon icon='line-md:account' width='64' height='64' />
							</div>
						)}

						<div>
							<Button
								color='default'
								radius='sm'
								size='md'
								onPress={handleClickAvatar}>
								<input
									type='file'
									className='hidden'
									accept='image/*'
									onChange={(e) =>
										e.target.files &&
										handleFileChange(Array.from(e.target.files))
									}
									ref={refAvatar}
								/>
								<CameraIcon className='w-4' />
								Сменить аватар
							</Button>
							<p className='mt-2 text-xs/5 text-gray-400'>
								JPG или PNG. 1MB Макс.
							</p>
						</div>
					</div>
					<Input
						className='sm:col-span-3'
						label='Имя'
						labelPlacement={'outside'}
						placeholder='Введите имя'
						type='text'
						radius='sm'
						defaultValue={name}
						{...methods.register('name')}
					/>
				</div>

				<Button
					type='submit'
					className='mt-8 flex bg-indigo-700 text-white shadow-lg hover:bg-indigo-800'
					radius='sm'
					size='md'>
					Сохранить
				</Button>
			</form>
		</div>
	);
}
