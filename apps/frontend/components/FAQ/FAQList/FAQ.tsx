import { functional } from 'sdk';
import { listFAQList } from '../FAQ.list';
import FAQItem from '../FAQItem/FAQItem';
import { createSDKConnection } from '@/shared/lib/config/sdk';
import { TGetFAQResponse } from 'sdk/lib/faq/faq.controller';

const connection = createSDKConnection({
	next: { tags: ['FAQ'] },
});

export default async function FAQList() {
	const faqData: TGetFAQResponse = await functional.v1.faq.getFAQData(
		connection,
		{
			page: 1,
			size: 10,
		},
	);

	return (
		<div className='grid grid-cols-3 gap-3 medium:grid-cols-2 mobile:grid-cols-1'>
			{faqData.map((faqItem) => (
				<FAQItem key={faqItem.id} FAQItem={faqItem} />
			))}
		</div>
	);
}
