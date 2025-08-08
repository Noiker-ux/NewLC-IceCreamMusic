import PaymentList from '@/components/PaymentList/PaymentList';
import { checkUserAdmin } from '../checkUserAdmin';

export const dynamic = 'force-dynamic';

export default async function PaymentAdminPage() {
	await checkUserAdmin();

	return (
		<>
			<PaymentList />
		</>
	);
}
