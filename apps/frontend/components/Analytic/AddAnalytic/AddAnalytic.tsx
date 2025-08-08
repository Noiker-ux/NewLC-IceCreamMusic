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
	DateRangePicker,
	Textarea,
} from '@heroui/react';
import { getLocalTimeZone, today } from '@internationalized/date';
import { ChartBarIcon } from '@heroicons/react/24/outline';
import { useForm, SubmitHandler } from 'react-hook-form';

import { Toaster, toast } from 'sonner';
import { TUpdateBalanceBody } from 'sdk/lib/user/user.controller';

import { useRouter } from 'next/navigation';
import { TCreateAnalyticsBody } from 'sdk/lib/analytics/analytics.controller';
import { I18nProvider } from '@react-aria/i18n';
import { actionCreateAnalytic } from './actionCreateAnalytic';

export default function AddAnalytic({ userId }: { userId: string }) {
	const { isOpen, onOpenChange } = useDisclosure();
	const methods = useForm<TCreateAnalyticsBody>({});
	const router = useRouter();

	const onSubmit: SubmitHandler<TCreateAnalyticsBody> = (data) => {
		toast.promise(
			actionCreateAnalytic({
				data: {
					userId: userId,
					...data,
				},
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
				<ChartBarIcon />
			</Button>
			<Toaster />
			<Modal size='lg' isOpen={isOpen} onOpenChange={onOpenChange}>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader>Статистика</ModalHeader>
							<ModalBody>
								<form
									className='flex flex-col gap-4 mt-5'
									// onSubmit={methods.handleSubmit(onSubmit)}
								>
									<I18nProvider locale='ru-RU'>
										<DateRangePicker
											label='Период'
											labelPlacement='outside'
											{...methods.register('data.periodStart')}
											onChange={(value) => {
												if (value) {
													if (value.start) {
														methods.setValue(
															'data.periodStart',
															value.start
																.toDate(getLocalTimeZone())
																.toISOString(),
														);
													}
													if (value.end) {
														methods.setValue(
															'data.periodFinish',
															value.end
																.toDate(getLocalTimeZone())
																.toISOString(),
														);
													}
												}
											}}
										/>
									</I18nProvider>
									<Textarea
										label={'Статистика'}
										labelPlacement='outside'
										size='lg'
										placeholder='Введите скрипт'></Textarea>
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
