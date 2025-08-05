import Image from 'next/image';
import DateFormatter from '@/utils/dateFormatter';
import { TVerification } from 'sdk/lib/verification/verification.controller';
import { Button, Tooltip } from '@heroui/react';
import { XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';
import { actionPatchStatus } from './actionPatchStatus';
import { Toaster, toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Primitive } from 'sdk';
export default function VerifyItem({
	verifyToken,
}: {
	verifyToken: Primitive<TVerification>;
}) {
	const router = useRouter();
	const handleApproved = () => {
		toast.promise(actionPatchStatus(verifyToken.id, 'approved'), {
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
		router.refresh();
	};

	const handleRejected = () => {
		toast.promise(actionPatchStatus(verifyToken.id, 'rejected'), {
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
		router.refresh();
	};

	return (
		<div key={verifyToken.id} className='bg-zinc-900 p-3 rounded-xl flex gap-5'>
			<Toaster />
			<div>
				<Image
					src='/assets/photo_2025-04-28_15-07-23.jpg'
					alt='Пользователь'
					width={400}
					height={600}
					className='h-full aspect-square object-cover rounded-lg'
				/>
			</div>
			<div className='w-full'>
				<div className='flex justify-between'>
					<div>
						<p className='font-semibold text-xl'>Основная инфомация</p>
						<p className='mt-1 text-xs'>
							Основные данные для создания драфта договора
						</p>
					</div>
					<div className='flex gap-2'>
						<Tooltip
							content={
								<div className='p-2'>
									<p>Подтвердить</p>
								</div>
							}>
							<Button isIconOnly color='success' onPress={handleApproved}>
								<CheckIcon width={20} />{' '}
							</Button>
						</Tooltip>
						<Tooltip content={<div className='p-2'>Отклонить</div>}>
							<Button isIconOnly color='danger' onPress={handleRejected}>
								<XMarkIcon width={20} />
							</Button>
						</Tooltip>
					</div>
				</div>
				<div className='flex flex-col mt-5'>
					<p className='text-md'>
						{verifyToken.firstName} {verifyToken.middleName}{' '}
						{verifyToken.lastName}
					</p>
					<div className='flex gap-3 mt-1'>
						<p className='text-zinc-500'>Дата рождения:</p>
						<p>{DateFormatter(new Date(verifyToken.birthDate))}</p>
					</div>
					<div className='flex gap-3 mt-1'>
						<p className='text-zinc-500'>Место проживания: </p>
						<p>{verifyToken.birthPlace}</p>
					</div>
					<div className='flex gap-3 mt-1'>
						<p className='text-zinc-500'>Телефон: </p>
						<p>{verifyToken.tel}</p>
					</div>
				</div>
				<p className='font-semibold text-xl mt-5'>Идентификационные данные</p>
				<div className='mt-3 grid grid-cols-2 gap-x-5'>
					<div className='flex gap-3 mt-1'>
						<p className='text-zinc-500'>Паспорт</p>
						<p>
							{verifyToken.passSeries} {verifyToken.passNumber}
						</p>
					</div>
					<div className='flex gap-3 mt-1'>
						<p className='text-zinc-500'>Кем выдан</p>
						<p>{verifyToken.givenBy}</p>
					</div>
					<div className='flex gap-3 mt-1'>
						<p className='text-zinc-500'>Дата получения</p>
						<p>{DateFormatter(new Date(verifyToken.getDate))}</p>
					</div>
					<div className='flex gap-3 mt-1'>
						<p className='text-zinc-500'>Код подразделения</p>
						<p>{verifyToken.subunitCode}</p>
					</div>
					<div className='flex gap-3 mt-1 col-span-2'>
						<p className='text-zinc-500'>Адрес регистрации</p>
						<p>{verifyToken.registrationAddress}</p>
					</div>
				</div>
				<p className='font-semibold text-xl mt-5'>Банковские реквизиты</p>
				<p className='mt-2'>
					{verifyToken.bankName}: {verifyToken.accountNumber}
				</p>
			</div>
		</div>
	);
}
