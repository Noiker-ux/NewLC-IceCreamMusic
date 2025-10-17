'use client';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from '@heroui/button';
import { Textarea } from '@heroui/input';
import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
} from '@heroui/modal';
import { Tooltip } from '@heroui/tooltip';
import { useDisclosure } from '@heroui/use-disclosure';
import { SubmitHandler, useForm } from 'react-hook-form';
import { handleChangeStatus } from './handleChangeStatus.func';
import { useRouter } from 'next/navigation';

export default function RejectedRelease({ id }: { id: string }) {
	const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
	const methods = useForm<{ reason: string }>({});
	const router = useRouter();

	const onSubmitRejectedRelease: SubmitHandler<{ reason: string }> = (e) => {
		handleChangeStatus({
			releaseId: id,
			reason: e.reason,
			status: 'rejected',
		});
		onClose();
		router.refresh();
	};

	return (
		<>
			<Tooltip
				content={
					<div className='p-2'>
						<p>Отклонить</p>
					</div>
				}>
				<Button isIconOnly color={'danger'} onPress={onOpen}>
					<XMarkIcon width={20} />
				</Button>
			</Tooltip>
			<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
				<ModalContent>
					{(onClose) => (
						<form onSubmit={methods.handleSubmit(onSubmitRejectedRelease)}>
							<ModalHeader>Причина отказа</ModalHeader>
							<ModalBody>
								<Textarea
									label='Введите причину отказа, указав пользователю на конкретные пункты и опишите причину отказа.'
									labelPlacement='outside'
									isClearable
									placeholder='Причина'
									{...methods.register('reason')}
								/>
							</ModalBody>
							<ModalFooter>
								<Button color={'danger'} type='submit'>
									Отклонить релиз
								</Button>
							</ModalFooter>
						</form>
					)}
				</ModalContent>
			</Modal>
		</>
	);
}
