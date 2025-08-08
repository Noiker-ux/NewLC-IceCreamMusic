import VerifyListAdmin from '@/components/Verification/VerifyListAdmin/VerifyListAdmin';
import { checkUserAdmin } from '../checkUserAdmin';
export const dynamic = 'force-dynamic';

export default async function VerifyAdminPage() {
	await checkUserAdmin();
	return (
		<>
			<VerifyListAdmin />
		</>
	);
}
