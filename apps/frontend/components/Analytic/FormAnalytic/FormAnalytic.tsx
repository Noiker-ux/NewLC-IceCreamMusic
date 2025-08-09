'use client';
import dateISOFormatter from '@/utils/dateISOFormatter';
import {
	Button,
	DatePicker,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Textarea,
	useDisclosure,
} from '@heroui/react';
import { parseAbsoluteToLocal } from '@internationalized/date';
import { I18nProvider } from '@react-aria/i18n';
import { useRouter } from 'next/navigation';
import { PropsWithChildren } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Primitive } from 'sdk';
import {
	TCreateAnalyticsBody,
	TGetAnalyticsResponse,
} from 'sdk/lib/analytics/analytics.controller';
import { Toaster, toast } from 'sonner';
import { actionCreateAnalytic } from './actionCreateAnalytic';

export default function FormAnalytic({
	userId,
	children,
	analytic,
}: {
	userId: string;
	analytic?: Primitive<TGetAnalyticsResponse['data']>;
} & PropsWithChildren) {
	const { isOpen, onOpenChange } = useDisclosure();

	const methods = useForm<TCreateAnalyticsBody['data']>({
		defaultValues: analytic,
	});

	const router = useRouter();

	const onSubmit: SubmitHandler<TCreateAnalyticsBody['data']> = (data) => {
		console.log(data);
		methods.reset();
		toast.promise(actionCreateAnalytic({ data: { ...data, userId: userId } }), {
			loading: 'Загрузка...',
			success: (responce) => {
				if (!responce.success) {
					return {
						message: `Произошла ошибка`,
						className: '!bg-red-300 !border-red-600 !text-red-800',
						duration: 500,
					};
				}
				return {
					message: responce.message,
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
		onOpenChange();
		router.refresh();
	};

	return (
		<>
			<Button
				onPress={onOpenChange}
				isIconOnly
				startContent={children}
				className='cursor-pointer  transition-all px-2'></Button>
			<Toaster />
			<Modal size='lg' isOpen={isOpen} onOpenChange={onOpenChange}>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader>Статистика</ModalHeader>
							<ModalBody>
								<form
									className='flex flex-col gap-4 mt-5'
									onSubmit={methods.handleSubmit(onSubmit)}>
									<div className='flex gap-1'>
										<I18nProvider locale='ru-RU'>
											<Controller
												control={methods.control}
												name='periodStart'
												render={({ field }) => (
													<DatePicker
														label='Дата начала'
														labelPlacement={'outside'}
														hideTimeZone={true}
														showMonthAndYearPickers={true}
														granularity='day'
														value={
															field.value &&
															parseAbsoluteToLocal(
																dateISOFormatter(new Date(field.value)),
															)
														}
														onChange={(value) => {
															if (value) {
																methods.setValue(
																	'periodStart',
																	value.toDate().toISOString(),
																);
															}
														}}
													/>
												)}
											/>
											<Controller
												control={methods.control}
												name='periodFinish'
												render={({ field }) => (
													<DatePicker
														label='Дата финиша'
														labelPlacement={'outside'}
														hideTimeZone={true}
														showMonthAndYearPickers={true}
														granularity='day'
														value={
															field.value &&
															parseAbsoluteToLocal(
																dateISOFormatter(new Date(field.value)),
															)
														}
														onChange={(value) => {
															if (value) {
																methods.setValue(
																	'periodFinish',
																	value.toDate().toISOString(),
																);
															}
														}}
													/>
												)}
											/>
										</I18nProvider>
									</div>
									<Textarea
										label={'Статистика'}
										labelPlacement='outside'
										size='lg'
										placeholder='Введите скрипт'
										{...methods.register('flourishReportMarkup')}
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
