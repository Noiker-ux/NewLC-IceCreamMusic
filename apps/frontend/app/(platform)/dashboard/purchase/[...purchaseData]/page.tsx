import { sessionCookieName } from '@/shared/lib/config/auth';
import { createSDKConnection } from '@/shared/lib/config/sdk';
import { Payment } from '@a2seven/yoo-checkout';
import { cookies } from 'next/headers';
import { functional } from 'sdk';
import { premiumPlans } from 'shared/helpers/premiumPlans';
import { paramsSchema, subscriptionLevels, TPremiumPlans } from './constants';
import { Button } from '@heroui/button';
import { PayButton } from './PayButton';

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

	return (
		<>
			<div>
				<table>
					<thead>
						<tr>
							<th>Услуга</th>
							<th>Стоимость</th>
						</tr>
					</thead>
					<tbody>
						{receipt.map((receiptItem) => (
							<tr key={receiptItem.description}>
								<td>{receiptItem.description}</td>
								<td>{receiptItem.amount.value}</td>
							</tr>
						))}
					</tbody>
					<tfoot>
						<tr>
							<th>Итого</th>
							<th>
								{receipt
									.reduce((summ, receiptItem) => {
										return summ + Number(receiptItem.amount.value);
									}, 0)
									.toFixed(2)}
							</th>
						</tr>
					</tfoot>
				</table>
			</div>
			<div>
				<PayButton
					orderType={paramsResult.data[0]}
					orderData={paramsResult.data[1]}
				/>
			</div>
		</>
	);
}
