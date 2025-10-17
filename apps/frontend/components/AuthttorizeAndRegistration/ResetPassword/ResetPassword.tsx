'use client';
import {
	resetPasswordSchema,
	TResetPassword,
} from 'shared/schema/reset.schema';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { resetPassword } from './action';
import { useRouter } from 'next/navigation';

type TResetPasswordForm = {
	token: string;
};

export function ResetPasswordForm({ token }: TResetPasswordForm) {
	const {
		handleSubmit,
		formState: { errors },
		register,
	} = useForm<TResetPassword>({
		resolver: zodResolver(resetPasswordSchema),
		defaultValues: {},
	});

	const router = useRouter();

	return (
		<form
			className='w-full flex flex-col gap-5 center col gap10'
			onSubmit={handleSubmit(async (data) => {
				const result = await resetPassword(token, data.password);

				if (result.success) {
					router.push('/auth/signin');
					return;
				}

				alert(result.error);
			})}>
			<Input
				label='Введите новый пароль'
				type='password'
				className='w-full'
				{...register('password')}
			/>
			<Input
				label='Повторите пароль'
				type='password'
				className='w-full'
				{...register('confirm')}
			/>
			<Button
				type='submit'
				disabled={!!errors.root || !!errors.confirm || !!errors.password}>
				Изменить пароль
			</Button>
		</form>
	);
}
