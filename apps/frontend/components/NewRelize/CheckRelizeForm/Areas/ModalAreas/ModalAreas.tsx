import { allCounty, sngAreasArray } from '@/data/allCounty';
import {
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from '@heroui/modal';
import Image from 'next/image';

export default function ModalAreas({
	isOpenProp,
	onOpenChangeProp,
	areas,
}: {
	isOpenProp: boolean;
	onOpenChangeProp: (isOpenProp: boolean) => void;
	areas: {
		data: string[];
		negate: boolean;
	};
}) {
	const getAreas = () => {
		if (areas.data.includes('all')) {
			return allCounty;
		}
		if (areas.data.includes('sng')) {
			return allCounty.filter((country) => {
				return sngAreasArray.includes(country.countryEn);
			});
		}
		if (areas.negate) {
			return allCounty.filter((country) => {
				return !areas.data.includes(country.countryEn);
			});
		}
		return allCounty.filter((country) => {
			return areas.data.includes(country.countryEn);
		});
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
							Список стран для публикации
						</ModalHeader>
						<ModalBody className='text-center grid grid-cols-3 auto-rows-min overflow-y-scroll scrollbar-hide h-min'>
							{getAreas()
								.sort((a, b) => {
									if (a.countryRu > b.countryRu) {
										return 1;
									}
									if (a.countryRu < b.countryRu) {
										return -1;
									}
									return 0;
								})
								.map((area) => (
									<div key={area.countryEn} className='flex gap-5'>
										<Image
											src={area.flag}
											width='20'
											height='18'
											alt={area.countryRu}
											className='w-7 h-4'
										/>
										<p className='text-sm'>{area.countryRu}</p>
									</div>
								))}
						</ModalBody>
					</>
				)}
			</ModalContent>
		</Modal>
	);
}
