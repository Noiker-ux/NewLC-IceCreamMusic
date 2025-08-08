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

import { Toaster, toast } from 'sonner';
import { TUpdateBalanceBody } from 'sdk/lib/user/user.controller';
import { actionPatchBalance } from './actionPatchBalance';
import { useRouter } from 'next/navigation';

export default function Balance({ userId }: { userId: string }) {
	const { isOpen, onOpenChange } = useDisclosure();
	const methods = useForm<TUpdateBalanceBody>({});
	const router = useRouter();

	const onSubmit: SubmitHandler<TUpdateBalanceBody> = (data) => {
		toast.promise(
			actionPatchBalance({
				balance: Number(data.data.balance),
				userId: userId,
			}),
			{
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
			},
		);
		methods.reset();
		onOpenChange();
		router.refresh();
	};
	return (
		<>
			<Button
				onPress={onOpenChange}
				isIconOnly
				className='cursor-pointer  transition-all px-2'>
				<BanknotesIcon />
			</Button>
			<Toaster />
			<Modal size='lg' isOpen={isOpen} onOpenChange={onOpenChange}>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader>Баланс</ModalHeader>
							<ModalBody>
								<form
									className='flex flex-col gap-4 mt-5'
									onSubmit={methods.handleSubmit(onSubmit)}>
									<Input
										label='Сумма'
										placeholder='Введите сумму'
										type='number'
										labelPlacement='outside'
										{...methods.register('data.balance')}
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
