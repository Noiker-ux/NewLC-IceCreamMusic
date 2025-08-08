import { checkout } from '@/shared/lib/config/aquiring';
import { createSDKConnection } from '@/shared/lib/config/sdk';
import { WebHookEvents } from '@a2seven/yoo-checkout';
import { NextResponse } from 'next/server';
import { functional } from 'sdk';

export const config = {
	runtime: 'nodejs',
};

export const runtime = 'nodejs';

const goodResponse = NextResponse.json(
	{
		message: 'Success',
	},
	{ status: 200 },
);

const badResponse = NextResponse.json(
	{ message: 'Bad request' },
	{ status: 400 },
);

const connection = createSDKConnection({});

export async function POST(req: Request) {
	const data = await req.json();

	if (
		data.type !== 'notification' ||
		!data.object ||
		!data.object.id ||
		!data.object.status
	) {
		return badResponse;
	}

	if (data.event === WebHookEvents['payment.succeeded']) {
		const payment = await checkout.getPayment(data.object.id).catch(() => null);

		if (!payment || payment.status !== data.object.status && payment.status !== 'succeeded') {
			console.log('no payment');
			return badResponse;
		}

		const result = await functional.v1.finance
			.confirmOrder(connection, payment.id)
			.catch((e: unknown) => {
				console.log(JSON.stringify(e, null, 2));
				return { success: false as const }
			});

		if (result.success) return goodResponse;
	}

	console.log('unnkown issue');
	return badResponse;
}
