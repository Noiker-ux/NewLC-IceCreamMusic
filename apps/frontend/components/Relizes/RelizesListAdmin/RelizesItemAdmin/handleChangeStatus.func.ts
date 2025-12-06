import { toast } from 'sonner';
import actionPatchTicketStatus from './actionPatchTicketStatus';

export const handleChangeStatus = ({
	releaseId,
	status,
	reason,
	upc,
}: {
	releaseId: string;
	status: 'moderating' | 'approved' | 'rejected';
	reason?: string;
	upc?: string;
}) => {
	toast.promise(actionPatchTicketStatus(releaseId, status, reason, upc).then(res=>{
		if(!res.success) {
			throw new Error(res.error)
		}
		return res;
	}), {
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
};
