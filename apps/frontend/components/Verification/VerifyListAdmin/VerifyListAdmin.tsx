'use client';
import { Select, SelectItem } from '@heroui/react';
import { actionGetVerifyList } from './actionGetVerifyList';
import { useState } from 'react';
import { TVerification } from 'sdk/lib/verification/verification.controller';
import VerifyItem from './VerifyItem/VerifyItem';

export default function VerifyListAdmin() {
	const listVerifyStatus = [
		{ status: 'moderating', label: 'На модерации' },
		{ status: 'approved', label: 'Подтвержден' },
		{ status: 'rejected', label: 'Отклонен' },
	];

	const [result, setResult] = useState<null | TVerification[]>();

	const handleChangeStatus = async (
		e: React.ChangeEvent<HTMLSelectElement>,
	) => {
		const responce = await actionGetVerifyList(
			e.target.value as 'moderating' | 'approved' | 'rejected',
		);
		if (responce.success) {
			setResult(responce.data);
		}
	};

	return (
		<div className='max-w-7xl'>
			<Select
				label={'Статус'}
				labelPlacement='outside'
				placeholder='Выберите статус подписки'
				defaultSelectedKeys={['moderating']}
				onChange={handleChangeStatus}>
				{listVerifyStatus.map((select) => (
					<SelectItem key={select.status}>{select.label}</SelectItem>
				))}
			</Select>
			<div className='flex flex-col gap-1 mt-3'>
				{result && result.length ? (
					result.map((verifyToken) => (
						<div key={verifyToken.id}>
							<VerifyItem verifyToken={verifyToken} />
						</div>
					))
				) : (
					<p className='text-3xl text-center mt-56'>
						Данные пока отсутствуют ^_^
					</p>
				)}
			</div>
		</div>
	);
}
