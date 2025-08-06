'use client';

import { Button } from '@heroui/button';
import { useRouter } from 'next/navigation';
import { makeOrder } from './action';
import { toast } from 'sonner';
import { purchaseTypeSchema } from './constants';
import z from 'zod';

export type TPayButton = {
	orderType: z.infer<typeof purchaseTypeSchema>;
	orderData: string;
};

export function PayButton({ orderData, orderType }: TPayButton) {
	const router = useRouter();

	return (
		<Button
			onPress={async () => {
				const result = await makeOrder(orderType, orderData);

				if (!result.success) {
					toast.error(result.error);
					return;
				}

				router.push(result.data.confirmation_url);
			}}>
			Оплатить
		</Button>
	);
}
