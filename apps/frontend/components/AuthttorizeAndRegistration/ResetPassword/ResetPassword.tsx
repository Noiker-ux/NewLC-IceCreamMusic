'use client';
import { resetPasswordSchema, TResetPassword } from '@/schema/reset.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { resetPassword } from '@/actions/auth';
import classNames from 'classnames';
import { Input } from '@heroui/input';
import { Button } from '@heroui/button';

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

	return (
		<form
			className={classNames('w100', 'center', 'col', 'gap10')}
			onSubmit={handleSubmit((data) => resetPassword(data.password, token))}>
			<Input
				label='Введите новый пароль'
				type='password'
				{...register('password')}
			/>
			<Input
				label='Повторите пароль'
				type='password'
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
