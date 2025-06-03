'use client';

import { TSignInClientSchema } from '@/schema/signin.schema';
import { enqueueSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { Input } from '@heroui/input';
import { Checkbox } from '@heroui/checkbox';
import { Button } from '@heroui/button';
import { credentialsSignIn } from '@/actions/auth';

const Authorization = () => {
	const { handleSubmit, register } = useForm<TSignInClientSchema>({
		defaultValues: {
			email: '',
			password: '',
			rememberMe: false,
		},
	});

	return (
		<form
			className={'flex w-[70%] mx-auto flex-col gap-5'}
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
			<Input {...register('email')} label='Email' type='text' />
			<Input {...register('password')} label='Пароль' type='password' />
			<Checkbox {...register('rememberMe')}>Запомнить пароль</Checkbox>
			<Button type='submit'>Войти</Button>
		</form>
	);
};

export default Authorization;
