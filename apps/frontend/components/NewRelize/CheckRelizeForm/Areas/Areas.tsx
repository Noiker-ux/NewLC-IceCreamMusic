import { allCounty } from '@/data/allCounty';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { Tooltip } from '@heroui/tooltip';
import ModalAreas from './ModalAreas/ModalAreas';
import { useDisclosure } from '@heroui/use-disclosure';

export default function Areas({
	areas,
}: {
	areas: {
		data: string[];
		negate: boolean;
	};
}) {
	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	const getAras = () => {
		if (areas.data.includes('all')) {
			return 'Все страны';
		}
		if (areas.data.includes('sng')) {
			return 'В странах СНГ';
		}
		if (areas.negate) {
			return allCounty.length - areas.data.length;
		}
		return areas.data.length;
	};

	return (
		<div className='flex gap-2'>
			<p className='text-sm '>{getAras()}</p>
			<Tooltip content={<div className='p-1 text-sm'>Показать список</div>}>
				<ArrowTopRightOnSquareIcon
					width={17}
					height={17}
					className='cursor-pointer hover:text-indigo-500 outline-none'
					onClick={onOpen}
				/>
			</Tooltip>
			<ModalAreas
				isOpenProp={isOpen}
				onOpenChangeProp={onOpenChange}
				areas={areas}
			/>
		</div>
	);
}
