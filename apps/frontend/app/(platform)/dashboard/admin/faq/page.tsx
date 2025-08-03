import FAQForm from '@/components/FAQ/FAQForm/FAQForm';
import FAQList from '@/components/FAQ/FAQList/FAQ';
import { createSDKConnection } from '@/shared/lib/config/sdk';
import { functional } from 'sdk';
import { TGetFAQResponse } from 'sdk/lib/faq/faq.controller';

export const dynamic = 'force-dynamic';

export default async function AdminFAQPage() {
	return (
		<div className='max-w-7xl'>
			<FAQForm color='default' isIconOnly={false}>
				Добавить
			</FAQForm>
			<FAQList />
		</div>
	);
}
