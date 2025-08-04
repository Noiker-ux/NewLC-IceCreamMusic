import { use } from 'react';
import { actionGetPayouts } from './actionGetPayouts';
import PaymentTicket from './PaymentTicket/PaymentTicket';

export default async function PaymentList() {
	const payouts = await actionGetPayouts();

	return (
		<>
			{payouts.success && payouts.data && payouts.data.data.length > 0 ? (
				<div className='flex flex-col gap-4'>
					{payouts.data.data.map((payout) => (
						<div key={payout.id}>
							<PaymentTicket payout={payout} />
						</div>
					))}
				</div>
			) : (
				<p className='text-3xl text-center'>Данные остутствуют</p>
			)}
		</>
	);
}
