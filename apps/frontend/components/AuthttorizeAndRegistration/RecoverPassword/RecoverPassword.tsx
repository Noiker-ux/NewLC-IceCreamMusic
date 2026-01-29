'use client';

import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { requestRecoveryToken } from './action';

export function RecoverPassword() {
	const [email, setEmail] = useState('');

	const router = useRouter();

	return (
		<div
			className={
				'text-white m-auto border-y-1 border-[#424242] w-full px-24 py-5 text-center relative'
			}>
			<div
				className={
					'flex justify-center items-center flex-col gap-5 my-auto w-[90%]'
				}>
				<div className='mb10'>
					Введите адрес эл. почты, привязанный к Вашей учетной записи.
				</div>
				<Input
					label='Email'
					type='text'
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
				<Button
					onPress={async () => {
						const result = await requestRecoveryToken(email);

						if (result.success) {
							router.push('/auth/signin');
						}
					}}>
					Отправить
				</Button>
			</div>
		</div>
	);
}
