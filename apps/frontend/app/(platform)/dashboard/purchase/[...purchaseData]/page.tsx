import { sessionCookieName } from '@/shared/lib/config/auth';
import { createSDKConnection } from '@/shared/lib/config/sdk';
import { Payment } from '@a2seven/yoo-checkout';
import { cookies } from 'next/headers';
import { functional } from 'sdk';
import { premiumPlans } from 'shared/helpers/premiumPlans';
import { paramsSchema, subscriptionLevels, TPremiumPlans } from './constants';
import { Button } from '@heroui/button';
import { PayButton } from './PayButton';
import React from 'react';

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
			<p className='text-3xl mb-3 font-bold'>Оплата</p>
			<div className='grid  grid-cols-2 max-w-3xl bg-zinc-900 p-5 rounded-xl'>
				<p className='pb-3'>Услуга</p>
				<p className='pb-3'>Стоимость</p>

				{receipt.map((receiptItem, idx) => (
					<React.Fragment key={receiptItem.description}>
						<p className='border-t-1 py-3 text-gray-400'>
							{idx + 1}
							{') '}
							{receiptItem.description}
						</p>
						<p className='border-t-1 py-3 text-gray-400'>
							{receiptItem.amount.value} ₽
						</p>
					</React.Fragment>
				))}

				<p className='border-t-1 font-bold pt-3'>Итого</p>
				<p className='border-t-1 pt-3'>
					{receipt
						.reduce((summ, receiptItem) => {
							return summ + Number(receiptItem.amount.value);
						}, 0)
						.toFixed(2)}{' '}
					₽
				</p>
			</div>
			<div className='mt-5'>
				<PayButton
					orderType={paramsResult.data[0]}
					orderData={paramsResult.data[1]}
				/>
			</div>
		</>
	);
}
