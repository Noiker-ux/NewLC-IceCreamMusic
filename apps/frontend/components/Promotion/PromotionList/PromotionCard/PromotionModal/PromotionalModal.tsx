import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
	Link,
} from '@heroui/react';
import { TPromotionalModal } from './PromotionalModal.props';
import Image from 'next/image';
export default function PromotionalModal({
	isOpenProp,
	onOpenChangeProp,
}: TPromotionalModal) {
	return (
		<Modal size='lg' isOpen={isOpenProp} onOpenChange={onOpenChangeProp}>
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader className='flex flex-col gap-1'>
							Оформление заказа
						</ModalHeader>
						<ModalBody className='text-center'>
							<Image
								src={'/assets/TG.png'}
								alt='Иконка телеграмм'
								width={140}
								height={140}
								className='mx-auto'
							/>
							<p>
								Пожалуйста, свяжитесь с нашим менеджером по рекламе. Вы сможете
								подробно обсудить вашу уникальную ситуацию
							</p>
						</ModalBody>
						<ModalFooter>
							<Button color='danger' variant='light' onPress={onClose}>
								Закрыть
							</Button>
							<Button
								color='default'
								onPress={onClose}
								as={Link}
								href={'https://t.me/Ckeabrona'}>
								Связаться с маркетологом
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
}
