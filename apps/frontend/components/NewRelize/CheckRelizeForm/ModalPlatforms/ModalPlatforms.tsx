import {
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from '@heroui/modal';
import Image from 'next/image';
import { allPlatforms } from '@/data/allPlatforms';

export default function ModalPlatfroms({
	isOpenProp,
	onOpenChangeProp,
	platfroms,
}: {
	isOpenProp: boolean;
	onOpenChangeProp: (isOpenProp: boolean) => void;
	platfroms: string[];
}) {
	const getPlatforms = () => {
		if (platfroms.includes('all')) {
			return allPlatforms;
		} else {
			return allPlatforms.filter((platfrom) => {
				return platfroms.includes(platfrom.name);
			});
		}
	};

	return (
		<Modal
			size='5xl'
			isOpen={isOpenProp}
			onOpenChange={onOpenChangeProp}
			className='h-[90%]'>
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader className='flex flex-col gap-1'>
							Список площадок для публикации
						</ModalHeader>
						<ModalBody className='text-center grid grid-cols-3 auto-rows-min overflow-y-scroll scrollbar-hide h-min'>
							{getPlatforms().map((platform) => (
								<div key={platform.name} className='flex gap-5'>
									<Image
										src={platform.icon}
										width='20'
										height='18'
										alt={platform.name}
										className='w-5 h-5'
									/>
									<p className='text-sm'>{platform.name}</p>
								</div>
							))}
						</ModalBody>
					</>
				)}
			</ModalContent>
		</Modal>
	);
}
