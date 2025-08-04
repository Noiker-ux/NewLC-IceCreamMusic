import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { Tooltip } from '@heroui/tooltip';
import { useDisclosure } from '@heroui/use-disclosure';
import ModalPlatfroms from './ModalPlatforms/ModalPlatforms';
import { TReleasePlatforms } from 'shared/schema/release.schema';
import { Primitive } from 'sdk';

export default function Platforms({
	platforms,
}: {
	platforms: Primitive<TReleasePlatforms>;
}) {
	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	const getPlatforms = () => {
		if (platforms.includes('all')) {
			return 'Все площадки';
		} else {
			return platforms.length;
		}
	};

	return (
		<div className='flex gap-2'>
			<p className='text-sm '>{getPlatforms()}</p>
			<Tooltip content={<div className='p-1 text-sm'>Показать список</div>}>
				<ArrowTopRightOnSquareIcon
					width={17}
					height={17}
					className='cursor-pointer hover:text-indigo-500 outline-none'
					onClick={onOpen}
				/>
			</Tooltip>{' '}
			<ModalPlatfroms
				isOpenProp={isOpen}
				onOpenChangeProp={onOpenChange}
				platfroms={platforms}
			/>
		</div>
	);
}
