import { functional } from 'sdk';
import FAQItem from '../FAQItem/FAQItem';
import { createSDKConnection } from '@/shared/lib/config/sdk';
import { TGetFAQResponse } from 'sdk/lib/faq/faq.controller';
import { Tooltip } from '@heroui/tooltip';
import { Button } from '@heroui/button';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import FAQForm from '../FAQForm/FAQForm';
import { actionDelete } from '../FAQForm/actionDelete';
import { cookies } from 'next/headers';
import { sessionCookieName } from '@/shared/lib/config/auth';

export default async function FAQList() {
	const cookieStore = await cookies();

	const sessionToken = cookieStore.get(sessionCookieName)?.value;

	const authHeaers = new Headers();

	authHeaers.set('Authorization', `${sessionToken}`);

	const connection = createSDKConnection({
		next: { tags: ['FAQ'] },
		headers: authHeaers,
	});

	const session = await functional.api.v1.auth
		.checkSessionToken(connection)
		.catch(() => null);

	const faqData: TGetFAQResponse = await functional.api.v1.faq.getFAQData(
		connection,
		{
			page: 1,
			size: 1000,
		},
	);

	return (
		<div className='grid grid-cols-3 gap-3 medium:grid-cols-2 mobile:grid-cols-1'>
			{faqData.map((faqItem) => (
				<div key={faqItem.id}>
					{session?.user.isAdmin && (
						<div className='flex justify-end gap-1 w-full mb-1'>
							<Tooltip
								content={
									<div className='p-2'>
										<p>Редактировать</p>
									</div>
								}>
								<FAQForm isIconOnly={true} editFAQ={faqItem} color='default'>
									<PencilSquareIcon width={20} />
								</FAQForm>
							</Tooltip>
							<Tooltip content={<div className='p-2'>Удалить</div>}>
								<FAQForm isIconOnly color='danger' idForDelete={faqItem.id}>
									<TrashIcon width={20} />
								</FAQForm>
							</Tooltip>
						</div>
					)}
					<FAQItem FAQItem={faqItem} />
				</div>
			))}
		</div>
	);
}
