import Account from '@/components/Account/Accont';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'ICECREAMMUSIC | Мой профиль',
	description:
		'ICECREAMMUSIC - Управляйте своим творчеством, продажами и маркетингом в одном месте, чтобы сделать вашу музыку заметной и доступной миллионам слушателей!',
};

export const dynamic = 'force-dynamic';

export default function ProfillePage() {
	return (
		<div className='divide-y divide-white/5'>
			<Account />
		</div>
	);
}
