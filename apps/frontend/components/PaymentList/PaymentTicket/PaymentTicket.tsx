import { Primitive } from 'sdk';
import { TGetPayoutTicketsResponse } from 'sdk/lib/finance/finance.controller';

export default function PaymentTicket({
	payout,
}: {
	payout: Primitive<TGetPayoutTicketsResponse['data'][number]>;
}) {
	return <> ticket 1</>;
}
