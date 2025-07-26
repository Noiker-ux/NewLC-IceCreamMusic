import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
	Link,
} from '@heroui/react';
import Image from 'next/image';
export default function ChatModal({
	isOpenProp,
	onOpenChangeProp,
}: {
	isOpenProp: boolean;
	onOpenChangeProp: (isOpenProp: boolean) => void;
}) {
	return (
		<Modal size='lg' isOpen={isOpenProp} onOpenChange={onOpenChangeProp}>
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader className='flex flex-col gap-1'>Поддержка</ModalHeader>
						<ModalBody className='text-center'>
							<Image
								src={'/assets/TG.png'}
								alt='Иконка телеграмм'
								width={140}
								height={140}
								className='mx-auto'
							/>
							<p>
								На данный момент, чат с командой ICECREAMMUSIC находится в
								разработке. Пожалуйста свяжитесь с нами через телеграмм.
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
								Написать в телеграмм
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
}
