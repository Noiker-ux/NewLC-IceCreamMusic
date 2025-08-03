import { createSDKConnection } from '@/shared/lib/config/sdk';
import { functional } from 'sdk';

const connection = createSDKConnection({
	next: { tags: ['SubscribeLvl'] },
});

export default async function SubscribeLVL() {
	// const faqData = await functional.v1.(connection, {
	// 	page: 1,
	// 	size: 10,
	// });
	return <>Ваша подписка</>;
}
