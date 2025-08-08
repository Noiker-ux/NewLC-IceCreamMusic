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
} from '@heroui/react';
import { getLocalTimeZone, parseDate, today } from '@internationalized/date';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Toaster, toast } from 'sonner';
import { useRouter } from 'next/navigation';
import {
	TAnalytics,
	TCreateAnalyticsBody,
	TGetAnalyticsResponse,
} from 'sdk/lib/analytics/analytics.controller';
import { I18nProvider } from '@react-aria/i18n';
import { PropsWithChildren } from 'react';
import { Primitive } from 'sdk';

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
			parseDate(analytic.periodStart).toDateString(),
		);
		methods.setValue('periodFinish', parseDate(analytic.periodFinish));
	}

	const onSubmit: SubmitHandler<TCreateAnalyticsBody['data']> = (data) => {
		methods.reset();
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
									<I18nProvider locale='ru-RU'>
										<DateRangePicker
											label='Период'
											labelPlacement='outside'
											{...methods.register('periodStart')}
											onChange={(value) => {
												if (value) {
													if (value.start) {
														methods.setValue(
															'periodStart',
															value.start
																.toDate(getLocalTimeZone())
																.toISOString(),
														);
													}
													if (value.end) {
														methods.setValue(
															'periodFinish',
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
