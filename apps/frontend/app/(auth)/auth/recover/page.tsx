'use client';

import { useState } from 'react';
import { Input } from '@heroui/input';
import { Button } from '@heroui/button';
import { requestRecoveryToken } from './action';
import { useRouter } from 'next/navigation';

export default function RecoverPage() {
	const [email, setEmail] = useState('');

	const router = useRouter();

	return (
		<div
			className={
				'text-white m-auto border-y-1 border-[#424242] w-full px-24 text-center relative'
			}>
			<div
				className={'flex justify-center items-center flex-col my-auto w-[90%]'}>
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
