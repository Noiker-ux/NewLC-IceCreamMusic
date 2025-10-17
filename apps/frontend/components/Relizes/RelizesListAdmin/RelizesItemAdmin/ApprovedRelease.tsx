import { CheckIcon } from '@heroicons/react/24/outline';
import { Tooltip } from '@heroui/tooltip';
import { Button } from '@heroui/button';
import { Toaster } from 'sonner';
import { handleChangeStatus } from './handleChangeStatus.func';
import {
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	useDisclosure,
} from '@heroui/modal';
import { Textarea } from '@heroui/input';
import { useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';

export default function ApprovedRelease({ id }: { id: string }) {
	const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
	const methods = useForm<{ upc: string }>({});
	const router = useRouter();

	const onSubmitApprovedRelease: SubmitHandler<{ upc: string }> = (e) => {
		handleChangeStatus({
			releaseId: id,
			upc: e.upc,
			status: 'approved',
		});
		onClose();
		router.refresh();
	};

	return (
		<>
			<Tooltip
				content={
					<div className='p-2'>
						<p>Подтвердить</p>
					</div>
				}>
				<Button isIconOnly color={'success'} onPress={onOpen}>
					<CheckIcon width={20} />
				</Button>
			</Tooltip>
			<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
				<ModalContent>
					{(onClose) => (
						<form onSubmit={methods.handleSubmit(onSubmitApprovedRelease)}>
							<ModalHeader>Причина отказа</ModalHeader>
							<ModalBody>
								<Textarea
									label='Введите UPC код релиза.'
									labelPlacement='outside'
									isClearable
									placeholder='UPC'
									{...methods.register('upc')}
								/>
							</ModalBody>
							<ModalFooter>
								<Button color={'success'} type='submit'>
									Принять релиз
								</Button>
							</ModalFooter>
						</form>
					)}
				</ModalContent>
			</Modal>
		</>
	);
}
