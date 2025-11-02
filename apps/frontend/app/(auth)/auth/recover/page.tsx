import { RecoverPassword } from '@/components/AuthttorizeAndRegistration/RecoverPassword/RecoverPassword';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'ICECREAMMUSIC | Восстановление пароля',
	description:
		'ICECREAMMUSIC - Управляйте своим творчеством, продажами и маркетингом в одном месте, чтобы сделать вашу музыку заметной и доступной миллионам слушателей!',
};

export default function RecoverPasswordPage() {
	return <RecoverPassword />;
}
