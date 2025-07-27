'use client';

import { SubmitHandler, useForm } from 'react-hook-form';
import { Input } from '@heroui/input';
import { Checkbox } from '@heroui/checkbox';
import { Button } from '@heroui/button';
import {
	signInClientSchema,
	TSignInClientSchema,
} from '@/schema/signin.schema';
import { actionAuthtorize } from './authtorizeAction';
import { zodResolver } from '@hookform/resolvers/zod';
import { yandexSignIn } from '@/features/auth/api/signin/yandex';
import { vkSignIn } from '@/features/auth/api/signin/vk';

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
			<Button type='submit'>Войти</Button>
			<hr />
			<Button
				onPress={() => {
					yandexSignIn('/dashboard');
				}}>
				yandex
			</Button>
			<hr />
			<Button
				onPress={() => {
					vkSignIn('/dashboard');
				}}>
				vk
			</Button>
		</form>
	);
}
