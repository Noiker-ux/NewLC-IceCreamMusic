'use client';
import { XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';
import { Button } from '@heroui/button';
import RelizecCard from '../../RelizesCard';
import { TGetReleaseListResponse } from 'sdk/lib/release/release.controller';
import { Primitive } from 'sdk';
import actionPatchTicketStatus from './actionPatchTicketStatus';
import { Toaster, toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Tooltip } from '@heroui/tooltip';

export default function RelizesItemAdmin({
	release,
}: {
	release: Primitive<TGetReleaseListResponse['data'][number]>;
}) {
	const router = useRouter();
	const handleChangeStatus = ({
		releaseId,
		status,
	}: {
		releaseId: string;
		status: 'moderating' | 'approved' | 'rejected';
	}) => {
		toast.promise(actionPatchTicketStatus(releaseId, status), {
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
		<>
			<div className='flex gap-3 bg-zinc-900 justify-end p-5 w-fit ml-auto -mb-2 rounded-t-xl'>
				<Toaster />
				<Tooltip
					content={
						<div className='p-2'>
							<p>Подтвердить</p>
						</div>
					}>
					<Button
						isIconOnly
						color={'success'}
						onPress={() => {
							handleChangeStatus({ releaseId: release.id, status: 'approved' });
						}}>
						<CheckIcon width={20} />
					</Button>
				</Tooltip>
				<Tooltip
					content={
						<div className='p-2'>
							<p>Отклонить</p>
						</div>
					}>
					<Button
						isIconOnly
						color={'danger'}
						onPress={() => {
							handleChangeStatus({ releaseId: release.id, status: 'rejected' });
						}}>
						<XMarkIcon width={20} />
					</Button>
				</Tooltip>
			</div>
			<RelizecCard release={release} />
		</>
	);
}
