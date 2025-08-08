import NewsListAdmin from '@/components/News/NewsListAdmin/NewsListAdmin';
import { checkUserAdmin } from '../checkUserAdmin';

export const dynamic = 'force-dynamic';

export default async function AdminNewsPage() {
	await checkUserAdmin();

	return (
		<>
			<NewsListAdmin />
		</>
	);
}
