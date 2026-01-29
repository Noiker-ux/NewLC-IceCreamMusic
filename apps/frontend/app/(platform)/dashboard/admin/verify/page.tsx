import VerifyListAdmin from '@/components/Verification/VerifyListAdmin/VerifyListAdmin';
import { checkUserAdmin } from '../checkUserAdmin';
import { Metadata } from 'next';
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
	title: 'ICECREAMMUSIC | Админ панель Верификация',
	description:
		'ICECREAMMUSIC - Управляйте своим творчеством, продажами и маркетингом в одном месте, чтобы сделать вашу музыку заметной и доступной миллионам слушателей!',
};

export default async function VerifyAdminPage() {
	await checkUserAdmin();
	return (
		<>
			<VerifyListAdmin />
		</>
	);
}
