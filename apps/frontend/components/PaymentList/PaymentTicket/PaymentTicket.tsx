'use client';
import MoneyFormatter from '@/utils/moneyFormatter';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from '@heroui/button';
import { Tooltip } from '@heroui/tooltip';
import { Primitive } from 'sdk';
import { TGetPayoutTicketsResponse } from 'sdk/lib/finance/finance.controller';
import { Toaster, toast } from 'sonner';
import { actionPatchStatus } from './actionPatchStatus';

export default function PaymentTicket({
	payout,
}: {
	payout: Primitive<TGetPayoutTicketsResponse['data'][number]>;
}) {
	const handleClickChangeStatus = ({
		ticketId,
		status,
	}: {
		ticketId: string;
		status: boolean;
	}) => {
		toast.promise(actionPatchStatus({ ticketId, status }), {
			loading: 'Загрузка...',
			success: (responce) => {
				return {
					message: `${responce.message}`,
					className: '!bg-green-300 !border-green-600 !text-green-800',
					duration: 500,
				};
			},
			error: (responce) => {
				return {
					message: `${responce.message}`,
					className: '!bg-red-300 !border-red-600 !text-red-800',
				};
			},
		});
	};

	return (
		<div className='bg-zinc-900 rounded-xl p-5 flex justify-between'>
			<div>
				<p>Тикет на выплату</p>
				<p>Получатель карты: {payout.recieverName}</p>
				<p>Номер карты: {payout.accountNumber}</p>
				<p>Сумма выплаты: {MoneyFormatter(payout.amount ?? 0)}</p>
				<p>
					Статус:{' '}
					{payout.confirmed ? (
						<span className='text-green-500'>Заявка закрыта</span>
					) : (
						<span className='text-red-500'>Новая заявка</span>
					)}
				</p>
			</div>
			<Toaster />
			<div className='flex gap-2'>
				<Tooltip
					content={
						<div className='p-2'>
							<p>Подтвердить выплату</p>
						</div>
					}>
					<Button
						isIconOnly
						color='success'
						onPress={() => {
							handleClickChangeStatus({
								ticketId: payout.id,
								status: true,
							});
						}}>
						<CheckIcon width={20} />
					</Button>
				</Tooltip>
				<Tooltip content={<div className='p-2'>Отклонить выплату</div>}>
					<Button
						isIconOnly
						color='danger'
						onPress={() => {
							handleClickChangeStatus({
								ticketId: payout.id,
								status: false,
							});
						}}>
						<XMarkIcon width={20} />
					</Button>
				</Tooltip>
			</div>
		</div>
	);
}
