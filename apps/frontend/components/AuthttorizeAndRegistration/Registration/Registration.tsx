'use client';

import {
	signUpClientSchema,
	TSignUpClientSchema,
} from 'shared/schema/signup.schema';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, SubmitErrorHandler, useForm } from 'react-hook-form';
import { actionRegister } from './registerAction';

const RegistrationWidget = () => {
	const methods = useForm({
		resolver: zodResolver(
			signUpClientSchema.refine(
				(data) => data.confirmPassword === data.password,
				{
					message: 'Пароли не совпадают',
					path: ['confirmPassword'],
				},
			),
		),
	});

	const onSubmit: SubmitHandler<TSignUpClientSchema> = async (data) => {
		const result = await actionRegister(data);
		if (!result.success) {
			methods.setError('email', {
				message: JSON.parse(result.error).message,
			});
		}
	};

	const onSubmitError: SubmitErrorHandler<TSignUpClientSchema> = (data) => {
		console.log('error', data);
	};

	return (
		<div>
			<form
				className={'flex flex-col gap-5'}
				onSubmit={methods.handleSubmit(onSubmit, onSubmitError)}>
				<Input
					{...methods.register('email')}
					label='Email'
					type='email'
					description={
						methods.formState.errors.email && (
							<p className='text-red-500'>
								{methods.formState.errors.email.message}
							</p>
						)
					}
				/>
				<Input {...methods.register('name')} label='Имя' type='text' />
				<Input
					{...methods.register('password')}
					label='Пароль'
					type='password'
				/>
				<Input
					{...methods.register('confirmPassword')}
					label='Подтвердите пароль'
					type='password'
					description={
						methods.formState.errors.confirmPassword && (
							<p className='text-red-500'>
								{methods.formState.errors.confirmPassword.message}
							</p>
						)
					}
				/>
				<Button type='submit'>Регистрация</Button>
			</form>
		</div>
	);
};
export default RegistrationWidget;
