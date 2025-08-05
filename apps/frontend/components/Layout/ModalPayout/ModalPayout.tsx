'use client';
import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
	useDisclosure,
	Input,
} from '@heroui/react';
import { PropsWithChildren } from 'react';
import { BanknotesIcon } from '@heroicons/react/24/outline';
import { useForm, SubmitHandler } from 'react-hook-form';
import { TPayoutTicketData } from 'sdk/lib/finance/finance.controller';
import { Toaster, toast } from 'sonner';
import { actionPostPayout } from './actionPostPayout';

export default function ModalPayout({
	maxBalance,
	children,
}: { maxBalance: number } & PropsWithChildren) {
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const methods = useForm<TPayoutTicketData>({});

	const onSubmit: SubmitHandler<TPayoutTicketData> = (data) => {
		console.log(data);
		toast.promise(actionPostPayout(data), {
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
		methods.reset();
		onOpenChange();
	};
	return (
		<>
			<Button
				onPress={onOpenChange}
				className='cursor-pointer  transition-all px-2'
				startContent={<BanknotesIcon />}>
				{children} ₽
			</Button>
			<Toaster />
			<Modal size='lg' isOpen={isOpen} onOpenChange={onOpenChange}>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader>Выплата средств</ModalHeader>
							<ModalBody>
								<p className='text-center text-xl font-bold'>Внимание!</p>
								<ul className='flex flex-col gap-0'>
									<li className='mt-0'>
										* Выплата средств проходит не мгновенно, просим Вас
										подождать.
									</li>
									<li className='mt-0'>
										* Минимальная сумма к выводу 2 000 рублей
									</li>
								</ul>
								<form
									className='flex flex-col gap-4 mt-5'
									onSubmit={methods.handleSubmit(onSubmit)}>
									<Input
										label='ФИО владельца карты'
										placeholder='Введите ФИО владельца карты'
										labelPlacement='outside'
										{...methods.register('recieverName')}
									/>
									<Input
										label='Номер карты'
										placeholder='Введите номер карты'
										labelPlacement='outside'
										{...methods.register('accountNumber')}
									/>
									<Input
										label='Сумма'
										placeholder='Введите сумму'
										type='number'
										max={maxBalance}
										min={2000}
										labelPlacement='outside'
										{...methods.register('amount')}
									/>
									<Button
										type='submit'
										className='bg-indigo-700 w-fit mx-auto mt-3'>
										Отправить
									</Button>
								</form>
							</ModalBody>
							<ModalFooter>
								<Button color='danger' variant='light' onPress={onClose}>
									Закрыть
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
}
