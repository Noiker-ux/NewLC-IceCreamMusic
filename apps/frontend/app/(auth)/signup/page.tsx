import RegistrationWidget from '@/components/AuthttorizeAndRegistration/Registration/Registration';
import Link from 'next/link';

export default function Registraion() {
	return (
		<div
			className={
				'text-white m-auto border-y-1 border-[#424242] w-full px-24 text-center relative'
			}>
			<h1 className={'text-5xl mb-2'}>Добро пожаловать!</h1>
			<p className={'mb-10'}>
				Если у вас нет аккаунта - зарегистрируйте его здесь,
				<br /> после авторизуйтесь для доступа в систему
			</p>
			<RegistrationWidget />
			<p className={'mt-5'}>
				Или
				<Link className={'text-white'} href={'/signin'}>
					войдите здесь
				</Link>
				, если у Вас есть аккаунт
			</p>
		</div>
	);
}
