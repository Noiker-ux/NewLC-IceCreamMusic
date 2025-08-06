'use client';
import { Button } from '@heroui/button';
import { Checkbox } from '@heroui/checkbox';
import { DatePicker } from '@heroui/date-picker';
import { Input } from '@heroui/input';
import { getLocalTimeZone, today } from '@internationalized/date';
import { ChangeEvent, useCallback, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { BsFillTelephoneFill } from 'react-icons/bs';
import { TVerificationFormSchema } from 'shared/schema/verification.schema';
import { Toaster, toast } from 'sonner';
import { actionPostVerify } from './actionPostVerify';

export default function VerificationForm() {
	const methods = useForm<TVerificationFormSchema>({});

	const onSubmit: SubmitHandler<TVerificationFormSchema> = useCallback(
		async (data) => {
			const verificationPromise = actionPostVerify({
				...data,
				contract: data.contract.name.split('.').slice(-1)[0],
			});

			toast.promise(verificationPromise, {
				loading: 'Загрузка...',
				success: (responce) => {
					if (!responce.success) {
						return {
							message: `${responce.error}`,
							className: '!bg-red-300 !border-red-600 !text-red-800',
							duration: 500,
						};
					}
					return {
						message: `Данные успешно отправлены на проверку`,
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

			const result = await verificationPromise;

			if (result.success) {
				const contractUploadToast = toast('Загружаем файл контракта');

				const totalBytes = data.contract.size;

				let uploaded = 0;

				const progressTrackingStream = new TransformStream({
					transform(chunk, controller) {
						controller.enqueue(chunk);
						uploaded += chunk.byteLength;

						toast(`${Math.round(uploaded / totalBytes)}%`, {
							id: contractUploadToast,
						});
					},
					flush() {
						toast.success(`${Math.round(uploaded / totalBytes)}%`, {
							id: contractUploadToast,
						});
					},
				});

				await fetch(result.data.contract, {
					method: 'PUT',
					body: data.contract.stream().pipeThrough(progressTrackingStream),
					duplex: 'half',
					headers: {
						'Content-Type': 'application/octet-stream',
						'Content-Length': String(totalBytes),
					},
				} as RequestInit);
			}
		},
		[],
	);

	const [phone, setPhone] = useState('');

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		let value = e.target.value.replace(/\D/g, '');
		value = value.replace(
			/(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})/,
			'+$1 ($2) $3-$4-$5',
		);
		setPhone(value);
	};

	return (
		<form
			className='flex flex-col gap-5'
			onSubmit={methods.handleSubmit(onSubmit)}>
			<Toaster />
			<div className='w-full'>
				<p className='font-semibold text-xl'>Основная информация</p>
				<p className='mt-1 text-xs'>
					Основные данные для создания драфта договора
				</p>
				<div className='mt-4 grid grid-cols-1  sm:grid-cols-2 md:grid-cols-3 gap-4'>
					<Input
						label='Фамилия'
						labelPlacement={'outside'}
						placeholder='Введите фамилию'
						type='text'
						isRequired
						radius='sm'
						{...methods.register('middleName')}
						pattern='^[A-ZА-Я][a-zа-я]+$'
						errorMessage={({ validationDetails, validationErrors }) => {
							if (validationDetails.patternMismatch) {
								return 'Фамилия должна начинаться с заглавной буквы и не иметь цифр, спецсимволов';
							}
							return validationErrors;
						}}
					/>
					<Input
						label='Имя'
						labelPlacement={'outside'}
						placeholder='Введите имя'
						type='text'
						isRequired
						radius='sm'
						{...methods.register('firstName')}
						pattern='^[A-ZА-Я][a-zа-я]+$'
						errorMessage={({ validationDetails, validationErrors }) => {
							if (validationDetails.patternMismatch) {
								return 'Имя должно начинаться с заглавной буквы и не иметь цифр, спецсимволов';
							}
							return validationErrors;
						}}
					/>
					<Input
						label='Отчество'
						labelPlacement={'outside'}
						placeholder='Введите отчество'
						type='text'
						radius='sm'
						{...methods.register('lastName')}
						pattern='^[A-ZА-Я][a-zа-я]+$'
						errorMessage={({ validationDetails, validationErrors }) => {
							if (validationDetails.patternMismatch) {
								return 'Отчество должно начинаться с заглавной буквы и не иметь цифр, спецсимволов';
							}
							return validationErrors;
						}}
					/>
					<DatePicker
						isRequired
						label='Дата рождения'
						labelPlacement={'outside'}
						{...methods.register('birthDate')}
						onChange={(value) => {
							if (value) {
								methods.setValue(
									'birthDate',
									value.toDate(getLocalTimeZone()).toISOString(),
								);
							}
						}}
						maxValue={today(getLocalTimeZone())}
						validate={(value) => {
							if (value.toDate(getLocalTimeZone()) > new Date()) {
								return 'Дата рождения не может быть больше текущей даты';
							}
						}}
						errorMessage={(value) => {
							if (!value.validationDetails.valid) {
								return 'Дата рождения не может быть больше текущей даты';
							}
						}}
					/>
					<Input
						label='Место рождения'
						{...methods.register('birthPlace')}
						labelPlacement={'outside'}
						placeholder='Введите место рождения'
						type='text'
						isRequired
						radius='sm'
					/>
					<Input
						label='Телефон'
						{...methods.register('tel')}
						labelPlacement={'outside'}
						placeholder='Введите телефон'
						startContent={<BsFillTelephoneFill className='w-4' color='gray' />}
						type='text'
						maxLength={11}
						value={phone}
						onChange={(e) => handleChange(e)}
						isRequired
						radius='sm'
					/>
				</div>
			</div>
			<div className='w-full'>
				<p className='font-semibold text-xl'>Идентификационные данные</p>
				<p className='mt-1 text-xs max-w-3xl'>
					Паспортные данные гарантируют оригинальность материала и отсутствие
					нарушений со стороны артиста, а также гарантируют выплату средств и
					исполнение условий с нашей стороны.
				</p>
				<div className='mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
					<Input
						label='Серия паспорта'
						{...methods.register('passSeries')}
						labelPlacement={'outside'}
						placeholder='Введите серию'
						type='text'
						maxLength={4}
						isRequired
						radius='sm'
						pattern='[0-9]{4}'
						errorMessage={({ validationDetails, validationErrors }) => {
							if (validationDetails.patternMismatch) {
								return 'Серия должна состоять из 4 цифр';
							}
							return validationErrors;
						}}
					/>
					<Input
						label='Номер паспорта'
						{...methods.register('passNumber')}
						labelPlacement={'outside'}
						placeholder='Введите номер'
						type='text'
						maxLength={6}
						isRequired
						radius='sm'
						pattern='[0-9]{6}'
						errorMessage={({ validationDetails, validationErrors }) => {
							if (validationDetails.patternMismatch) {
								return 'Номер паспорта должен состоять из 6 цифр';
							}
							return validationErrors;
						}}
					/>
					<DatePicker
						isRequired
						{...methods.register('getDate')}
						onChange={(value) => {
							if (value) {
								methods.setValue(
									'getDate',
									value.toDate(getLocalTimeZone()).toISOString(),
								);
							}
						}}
						label='Дата получения'
						labelPlacement={'outside'}
						validate={(value) => {
							if (value.toDate(getLocalTimeZone()) > new Date()) {
								return 'Дата получения не может быть больше текущей даты';
							}
						}}
						errorMessage={(value) => {
							if (!value.validationDetails.valid) {
								return 'Дата получения не может быть больше текущей даты';
							}
						}}
					/>
					<Input
						label='Кем выдан'
						{...methods.register('givenBy')}
						labelPlacement={'outside'}
						placeholder='Введите кем выдан'
						type='text'
						isRequired
						radius='sm'
					/>
					<Input
						label='Код подразделения'
						{...methods.register('subunitCode')}
						labelPlacement={'outside'}
						placeholder='Введите код подразделения'
						type='text'
						isRequired
						maxLength={6}
						pattern='[0-9]{6}'
						errorMessage={({ validationDetails, validationErrors }) => {
							if (validationDetails.patternMismatch) {
								return 'Код подразделения должен состоять из 6 цифр';
							}
							return validationErrors;
						}}
						radius='sm'
					/>
					<Input
						label='Адрес регистрации'
						{...methods.register('registrationAddress')}
						labelPlacement={'outside'}
						placeholder='Введите адрес'
						type='text'
						isRequired
						radius='sm'
					/>
				</div>
			</div>
			<div className='w-full'>
				<p className='font-semibold text-xl'>Банковские реквизиты</p>
				<p className='mt-1 text-xs max-w-3xl'>
					Банковские данные требуются для выплаты средств, в случае, если автор
					не может самостоятельно предоставить актуальные реквизиты
				</p>
				<div className='mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
					<Input
						label='Номер счета'
						{...methods.register('accountNumber')}
						labelPlacement={'outside'}
						placeholder='Введите серию'
						type='text'
						maxLength={20}
						isRequired
						radius='sm'
						pattern='[0-9]{20}'
						errorMessage={({ validationDetails, validationErrors }) => {
							if (validationDetails.patternMismatch) {
								return 'Номер счета должен состоять из 20 цифр';
							}
							return validationErrors;
						}}
					/>
					<Input
						label='Наименование банка'
						{...methods.register('bankName')}
						labelPlacement={'outside'}
						placeholder='Введите наименование банка'
						type='text'
						isRequired
						radius='sm'
					/>
				</div>
			</div>
			<div className='w-full'>
				<p className='font-semibold text-xl'>Подписанный договор</p>

				<div className='mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
					<input
						type='file'
						onChange={(e) => {
							const files = e.target.files;
							let newFile = null;
							if (files) newFile = files[0];
							if (newFile) methods.setValue('contract', newFile);
						}}
					/>
				</div>
			</div>
			<Checkbox isRequired color='default' radius='sm' size='sm'>
				<p className='text-zinc-500'>
					Я даю своё согласие на обработку персональных данных
				</p>
			</Checkbox>
			<div>
				<Button
					type='submit'
					className='w-auto bg-indigo-700 text-white shadow-lg hover:bg-indigo-800'>
					Отправить
				</Button>
			</div>
		</form>
	);
}
