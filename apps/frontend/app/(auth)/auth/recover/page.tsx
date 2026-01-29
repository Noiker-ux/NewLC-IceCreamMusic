import { RecoverPassword } from '@/components/AuthttorizeAndRegistration/RecoverPassword/RecoverPassword';
import { Metadata } from 'next';

<<<<<<< HEAD
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { useState } from 'react';

export default function RecoverPage() {
	const [email, setEmail] = useState('');

	return (
		<div
			className={
				'text-white m-auto border-y-1 border-[#424242] w-full p-24 text-center relative'
			}>
			<div
				className={'flex justify-center items-center flex-col my-auto w-[90%]'}>
				<div className='mb-10'>
					Введите адрес эл. почты, привязанный к Вашей учетной записи.
				</div>
				<Input
					variant='underlined'
					label='Email'
					type='text'
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
				<Button className='mt-5' type='submit'>
					Отправить
				</Button>
			</div>
		</div>
	);
=======
export const metadata: Metadata = {
	title: 'ICECREAMMUSIC | Восстановление пароля',
	description:
		'ICECREAMMUSIC - Управляйте своим творчеством, продажами и маркетингом в одном месте, чтобы сделать вашу музыку заметной и доступной миллионам слушателей!',
};

export default function RecoverPasswordPage() {
	return <RecoverPassword />;
>>>>>>> 3ea385da3d404015abbe2908d8e00c3ada67969a
}
