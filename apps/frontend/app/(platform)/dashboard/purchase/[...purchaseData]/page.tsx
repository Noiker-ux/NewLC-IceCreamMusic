import { sessionCookieName } from '@/shared/lib/config/auth';
import { createSDKConnection } from '@/shared/lib/config/sdk';
import { Payment } from '@a2seven/yoo-checkout';
import { cookies } from 'next/headers';
import { functional } from 'sdk';
import { premiumPlans } from 'shared/helpers/premiumPlans';
import { paramsSchema, subscriptionLevels, TPremiumPlans } from './action';

export default async function PurchasePage({
	params,
}: {
	params: Promise<{ purchaseData: TPremiumPlans }>;
}) {
	const paramsResult = paramsSchema.safeParse((await params).purchaseData);

	if (!paramsResult.success) {
		return <>invalid params {JSON.stringify(paramsResult.error)}</>;
	}

	const cookiesStore = await cookies();

	const sessionToken = cookiesStore.get(sessionCookieName)?.value;

	if (!sessionToken) {
		return <>unauthorized</>;
	}

	const receiptHeaders = new Headers();

	receiptHeaders.set('Authorization', sessionToken);

	const receiptConnection = createSDKConnection({ headers: receiptHeaders });

	let receipt: Payment['receipt']['items'] = [];

	if (paramsResult.data[0] === 'release') {
		const receiptResponse =
			await functional.v1.finance.release.getReleaseEstimate(
				receiptConnection,
				paramsResult.data[1],
			);

		receipt = receiptResponse.data;
	}

	if (paramsResult.data[0] === 'subscription') {
		const isValidSubscriptionLevel = subscriptionLevels.includes(
			paramsResult.data[1],
		);

		if (!isValidSubscriptionLevel) {
			return <>invalid subscription level</>;
		}

		const subscriptionLevelReceipt =
			await functional.v1.finance.subscription.getSubscriptionEstimate(
				receiptConnection,
				paramsResult.data[1] as keyof typeof premiumPlans,
			);

		receipt = subscriptionLevelReceipt.data;
	}

	return <>purchase page {JSON.stringify(receipt)}</>;
}
