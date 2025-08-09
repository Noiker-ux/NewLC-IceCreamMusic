'use client';
import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
	useDisclosure,
	DateRangePicker,
	Textarea,
	DatePicker,
} from '@heroui/react';
import {
	getLocalTimeZone,
	parseAbsoluteToLocal,
	parseDate,
	today,
} from '@internationalized/date';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Toaster, toast } from 'sonner';
import { useRouter } from 'next/navigation';
import {
	TAnalytics,
	TCreateAnalyticsBody,
	TGetAnalyticsResponse,
} from 'sdk/lib/analytics/analytics.controller';
import { I18nProvider } from '@react-aria/i18n';
import { PropsWithChildren, useRef } from 'react';
import { Primitive } from 'sdk';
import { actionCreateAnalytic } from './actionCreateAnalytic';
import dateISOFormatter from '@/utils/dateISOFormatter';

export default function FormAnalytic({
	userId,
	children,
	analytic,
}: {
	userId: string;
	analytic?: Primitive<TGetAnalyticsResponse['data']>;
} & PropsWithChildren) {
	const { isOpen, onOpenChange } = useDisclosure();
	const methods = useForm<TCreateAnalyticsBody['data']>({});
	const router = useRouter();

	if (analytic) {
		methods.setValue('flourishReportMarkup', analytic.flourishReportMarkup);
		methods.setValue(
			'periodStart',
			new Date(analytic.periodStart).toISOString(),
		);
		methods.setValue(
			'periodFinish',
			new Date(analytic.periodFinish).toISOString(),
		);
	}

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
											<DatePicker
												label='Дата начала'
												labelPlacement={'outside'}
												hideTimeZone={true}
												showMonthAndYearPickers={true}
												{...methods.register('periodStart')}
												onChange={(value) => {
													if (value) {
														methods.setValue(
															'periodStart',
															value.toDate(getLocalTimeZone()).toISOString(),
														);
													}
												}}
											/>{' '}
											<DatePicker
												label='Дата финиша'
												labelPlacement={'outside'}
												hideTimeZone={true}
												showMonthAndYearPickers={true}
												{...methods.register('periodFinish')}
												onChange={(value) => {
													if (value) {
														methods.setValue(
															'periodFinish',
															value.toDate(getLocalTimeZone()).toISOString(),
														);
													}
												}}
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
