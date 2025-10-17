import PaymentList from '@/components/PaymentList/PaymentList';
import { checkUserAdmin } from '../checkUserAdmin';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'ICECREAMMUSIC | Админ панель Выплаты',
	description:
		'ICECREAMMUSIC - Управляйте своим творчеством, продажами и маркетингом в одном месте, чтобы сделать вашу музыку заметной и доступной миллионам слушателей!',
};

export const dynamic = 'force-dynamic';

export default async function PaymentAdminPage() {
	await checkUserAdmin();

	return (
		<>
			<PaymentList />
		</>
	);
}
