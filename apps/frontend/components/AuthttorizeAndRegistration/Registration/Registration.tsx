'use client';

import {
	signUpClientSchema,
	TSignUpClientSchema,
} from '@/schema/signup.schema';
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
			),
		),
	});

	const onSubmit: SubmitHandler<TSignUpClientSchema> = (data) => {
		actionRegister(data);
	};

	const onSubmitError: SubmitErrorHandler<TSignUpClientSchema> = (data) => {
		console.log('error');
	};

	return (
		<div>
			<form
				className={'flex flex-col gap-5'}
				onSubmit={methods.handleSubmit(onSubmit, onSubmitError)}>
				<Input {...methods.register('email')} label='Email' type='email' />
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
				/>
				<Button type='submit'>Регистрация</Button>
			</form>
		</div>
	);
};
export default RegistrationWidget;
