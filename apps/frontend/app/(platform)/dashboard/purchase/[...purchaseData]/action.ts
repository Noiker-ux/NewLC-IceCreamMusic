'use server';

import { TActionResult } from '@/components/Account/actionGetPersonalData';
import { sessionCookieName } from '@/shared/lib/config/auth';
import { createSDKConnection } from '@/shared/lib/config/sdk';
import { cookies } from 'next/headers';
import { functional } from 'sdk';
import { TMakeOrderResponse } from 'sdk/lib/finance/finance.controller';
import z from 'zod';
import { purchaseTypeSchema, subscriptionLevels, TPremiumPlans } from './constants';

export async function makeOrder(
	orderType: z.infer<typeof purchaseTypeSchema>,
	orderData: string,
): Promise<TActionResult<TMakeOrderResponse>> {
	const cookiesStore = await cookies();

	const sessionToken = cookiesStore.get(sessionCookieName)?.value;

	if (!sessionToken)
		return {
			success: false as const,
			error: 'Не авторизован',
		};

	const orderHeaders = new Headers();

	orderHeaders.set('Authorization', sessionToken);

	const orderConnection = createSDKConnection({ headers: orderHeaders });

	if (orderType === 'subscription') {
		const isSubscriptionLevel = subscriptionLevels.includes(orderData);

		if (!isSubscriptionLevel) {
			return {
				success: false as const,
				error: 'Неверный уровень подписки',
			};
		}

		const result = await functional.api.v1.finance.createOrder(orderConnection, {
			type: 'subscription',
			subscriptionLevel: orderData as TPremiumPlans,
		});

		return {
			success: true as const,
			data: result,
		};
	}

	if (orderType === 'release') {
		const result = await functional.api.v1.finance.createOrder(orderConnection, {
			type: 'release',
			releaseId: orderData,
		});

		return {
			success: true as const,
			data: result,
		};
	}

	return {
		success: false as const,
		error: 'Неизвестная ошибка',
	};
}
