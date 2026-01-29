import RegistrationWidget from '@/components/AuthttorizeAndRegistration/Registration/Registration';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
	title: 'ICECREAMMUSIC | Регистрация',
	description:
		'ICECREAMMUSIC - Управляйте своим творчеством, продажами и маркетингом в одном месте, чтобы сделать вашу музыку заметной и доступной миллионам слушателей!',
};

export default function Registraion() {
	return (
		<div
			className={
<<<<<<< HEAD:apps/frontend/app/(auth)/signup/page.tsx
				'text-white m-auto border-y-1 border-[#424242] w-full py-24 text-center relative'
=======
				'text-white m-auto border-y-1 border-[#424242] w-full px-24 text-center relative -z-10'
>>>>>>> origin/vk-auth:apps/frontend/app/(auth)/auth/signup/page.tsx
			}>
			<h1 className={'text-5xl mb-2'}>Добро пожаловать!</h1>
			<p className={'mb-10'}>
				Если у вас нет аккаунта - зарегистрируйте его здесь,
				<br /> после авторизуйтесь для доступа в систему
			</p>
			<RegistrationWidget />
			<p className={'mt-5'}>
				Или{' '}
				<Link className={'text-white underline'} href={'/signin'}>
					войдите здесь
				</Link>
				, если у Вас есть аккаунт
			</p>
		</div>
	);
}
