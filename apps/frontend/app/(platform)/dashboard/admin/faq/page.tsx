import FAQForm from '@/components/FAQ/FAQForm/FAQForm';
import FAQList from '@/components/FAQ/FAQList/FAQ';
import { checkUserAdmin } from '../checkUserAdmin';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'ICECREAMMUSIC | Админ панель FAQ',
	description:
		'ICECREAMMUSIC - Управляйте своим творчеством, продажами и маркетингом в одном месте, чтобы сделать вашу музыку заметной и доступной миллионам слушателей!',
};

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
