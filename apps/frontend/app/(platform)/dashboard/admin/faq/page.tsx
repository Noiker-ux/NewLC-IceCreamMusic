import FAQForm from '@/components/FAQ/FAQForm/FAQForm';
import FAQList from '@/components/FAQ/FAQList/FAQ';
import { checkUserAdmin } from '../checkUserAdmin';

export const dynamic = 'force-dynamic';

export default async function AdminFAQPage() {
	await checkUserAdmin();

	return (
		<div className='max-w-7xl'>
			<FAQForm color='default' isIconOnly={false}>
				Добавить
			</FAQForm>
			<FAQList />
		</div>
	);
}
