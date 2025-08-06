'use client';
import {
	Modal,
	ModalBody,
	ModalContent,
	ModalHeader,
	useDisclosure,
} from '@heroui/modal';
import { Button } from '@heroui/button';
import { Bars3BottomLeftIcon } from '@heroicons/react/24/outline';
import { Tooltip } from '@heroui/tooltip';
import { toast } from 'sonner';
import { cn } from '@/utils/cn';

export default function ModalTextTrack({
	text,
}: {
	text?: string | null | undefined;
}) {
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	return (
		<>
			<Tooltip
				content={
					<div className='p-2'>
						<p>{text ? 'Текст трека доступен' : 'Текст трека отсутствует'}</p>
					</div>
				}>
				<Button
					isIconOnly
					variant='light'
					onPress={() => {
						if (!text) {
							toast.error('Текст трека отсутствует');
							return;
						}
						onOpen();
					}}
					className={cn(
						text ? 'text-indigo-400 border border-indigo-400' : '',
					)}>
					<Bars3BottomLeftIcon width={20} />
				</Button>
			</Tooltip>
			<Modal isOpen={isOpen} onOpenChange={onOpenChange} size={'5xl'}>
				<ModalContent>
					{() => (
						<>
							<ModalHeader className='flex flex-col gap-1'>
								Текст трека
							</ModalHeader>
							<ModalBody>{text}</ModalBody>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
}
