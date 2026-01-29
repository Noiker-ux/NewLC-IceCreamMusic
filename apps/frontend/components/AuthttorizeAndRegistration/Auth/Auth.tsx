'use client';

import { SubmitHandler, useForm } from 'react-hook-form';
import { Input } from '@heroui/input';
import { Checkbox } from '@heroui/checkbox';
import { Button } from '@heroui/button';
import {
	signInClientSchema,
	TSignInClientSchema,
} from 'shared/schema/signin.schema';
import { actionAuthtorize } from './authtorizeAction';
import { zodResolver } from '@hookform/resolvers/zod';
import { yandexSignIn } from '@/features/signin/api/yandex';
import { vkSignIn } from '@/features/signin/api/vk';
import { FaVk, FaYandex } from 'react-icons/fa6';

export default function Authorization() {
	const methods = useForm({
		resolver: zodResolver(signInClientSchema),
	});

	const onSubmit: SubmitHandler<TSignInClientSchema> = async (data) => {
		const result = await actionAuthtorize(data);
		if (result && !result.success) {
			methods.setError('password', {
				message: JSON.parse(result?.error).message,
			});
		}
	};

	return (
		<form
<<<<<<< HEAD
			className={'flex w-[70%] mx-auto flex-col gap-5 '}
			onSubmit={handleSubmit((data) => {
				credentialsSignIn(data)
					.then((res) => {
						enqueueSnackbar({
							message: res?.message ?? 'Авторизация выполнена успешно',
							variant: res?.success !== false ? 'success' : 'error',
						});
					})
					.catch((e) => {
						enqueueSnackbar({
							message: e.message,
							variant: 'error',
						});
					});
			})}>
			<Input
				variant='underlined'
				{...register('email')}
				label='Email'
				type='text'
			/>
			<Input
				variant='underlined'
				{...register('password')}
				label='Пароль'
				type='password'
			/>
			<Checkbox color='default' {...register('rememberMe')}>
				Запомнить пароль
			</Checkbox>
=======
			className={'flex w-[70%] mx-auto flex-col gap-5'}
			onSubmit={methods.handleSubmit(onSubmit)}>
			<Input {...methods.register('email')} label='Email' type='text' />
			<Input
				{...methods.register('password')}
				label='Пароль'
				type='password'
				description={
					methods.formState.errors.password && (
						<p className='text-red-500'>
							{methods.formState.errors.password.message}
						</p>
					)
				}
			/>
			<Checkbox {...methods.register('rememberMe')}>Запомнить пароль</Checkbox>
>>>>>>> origin/vk-auth
			<Button type='submit'>Войти</Button>
			<div className='flex justify-center gap-3'>
				<Button
					isIconOnly
					className='bg-[#cc4b34]'
					onPress={() => {
						yandexSignIn('/dashboard');
					}}
					startContent={<FaYandex className='w-10' />}></Button>

				<Button
					isIconOnly
					className='bg-[#1890FF]'
					onPress={() => {
						vkSignIn('/dashboard');
					}}
					startContent={<FaVk className='w-10' />}></Button>
			</div>
		</form>
	);
}
