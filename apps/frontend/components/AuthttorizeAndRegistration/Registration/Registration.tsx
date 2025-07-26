'use client';

import { registerUser } from '@/actions/users';
import {
	signUpClientSchema,
	TSignUpClientSchema,
} from '@/schema/signup.schema';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';

import { zodResolver } from '@hookform/resolvers/zod';
import { enqueueSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';

const RegistrationWidget = () => {
	const { handleSubmit, register } = useForm<TSignUpClientSchema>({
		resolver: zodResolver(
			signUpClientSchema.refine(
				(data) => data.confirmPassword === data.password,
			),
		),
		defaultValues: {
			confirmPassword: '',
			email: '',
			name: '',
			password: '',
		},
		progressive: true,
	});

	return (
		<form
			className={'flex w-[70%] mx-auto flex-col gap-5'}
			onSubmit={handleSubmit((data) => {
				registerUser(data).then((e) => {
					enqueueSnackbar({ message: e.message, variant: 'error' });
				});
			})}>
			<Input {...register('email')} label='Email' type='email' />
			<Input {...register('name')} label='Имя' type='text' />
			<Input {...register('password')} label='Пароль' type='password' />
			<Input
				{...register('confirmPassword')}
				label='Подтвердите пароль'
				type='password'
			/>
			<Button type='submit'>Регистрация</Button>
		</form>
	);
};
export default RegistrationWidget;
