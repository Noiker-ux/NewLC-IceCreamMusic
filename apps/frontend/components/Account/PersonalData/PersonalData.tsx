'use client';
import { Input } from '@heroui/input';
import { Button } from '@heroui/button';
import { CameraIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { use } from 'react';
import { actionGetPersonalData, TActionResult } from '../actionGetPersonalData';
import { Icon } from '@iconify/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { TGetMeResponse } from 'sdk/lib/user/user.controller';

export default function PersonalDataProps({
	PersonalDataProps,
}: {
	PersonalDataProps: TActionResult<TGetMeResponse['data']>;
}) {
	const methods = useForm<any>({});
	if (!PersonalDataProps.success) {
		return <>Упс :(</>;
	}

	const { name, avatar, email } = PersonalDataProps.data;

	const FSName = name.split(' ');

	const onSubmit: SubmitHandler<any> = async (data) => {
		console.log(data);
	};

	return (
		<div className='grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8'>
			<div>
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
						{avatar ? (
							<Image
								width={96}
								height={96}
								alt='Превью аватара'
								src={avatar}
								className='size-24 flex-none rounded-lg bg-gray-800 object-cover'
							/>
						) : (
							<div className='w-12'>
								<Icon icon='line-md:account' width='64' height='64' />
							</div>
						)}

						<div>
							<Button color='default' radius='sm' size='md'>
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
						defaultValue={FSName[0]}
						{...methods.register('firstName')}
					/>
					<Input
						className='sm:col-span-3'
						label='Фамилия'
						labelPlacement={'outside'}
						defaultValue={FSName[1] ?? ''}
						placeholder='Введите имя'
						type='text'
						radius='sm'
						{...methods.register('secondName')}
					/>
					<Input
						className='col-span-full'
						label='E-mail'
						labelPlacement={'outside'}
						placeholder='Введите email / Логин'
						defaultValue={email}
						type='email'
						radius='sm'
						{...methods.register('email')}
					/>
				</div>

				<Button
					className='mt-8 flex bg-indigo-700 text-white shadow-lg hover:bg-indigo-800'
					radius='sm'
					size='md'>
					Сохранить
				</Button>
			</form>
		</div>
	);
}
