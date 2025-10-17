import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'ICECREAMMUSIC | Регистрация сообщение на почте',
	description:
		'ICECREAMMUSIC - Управляйте своим творчеством, продажами и маркетингом в одном месте, чтобы сделать вашу музыку заметной и доступной миллионам слушателей!',
};

export default function CompleteSignupPage() {
	return (
		<div
			className={
				'text-white m-auto border-y-1 border-[#424242] w-full px-24 text-center relative'
			}>
			<div>
				На указанный адрес эл. почты выслано сообщение с дополнительными
				инструкциями.
			</div>
			<div>Вы можете закрыть эту вкладку</div>
		</div>
	);
}
