import Link from 'next/link';
import Authorization from '@/components/AuthttorizeAndRegistration/Auth/Auth';

export default function Auth() {
	return (
		<div
			className={
				'text-white m-auto border-y-1 border-[#424242] w-full px-24 text-center relative'
			}>
			<h1 className={'text-5xl mb-2'}>Авторизация</h1>
			<p className={'mb-10'}>
				Вы должны быть авторизованы, чтобы получить доступ к сайту
			</p>
			<Authorization />
			<p className={'mt-5'}>
				Или{' '}
				<Link className={'text-white'} href='/signup'>
					зарегистрируйте
				</Link>{' '}
				новый, если у Вас нет аккаунта
			</p>

			<p className={'mt-5'}>
				<Link className={'text-white'} href='/recover'>
					Не помню пароль
				</Link>
			</p>
		</div>
	);
}
