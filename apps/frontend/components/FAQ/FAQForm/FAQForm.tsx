'use client';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { Button } from '@heroui/button';
import { Input, Textarea } from '@heroui/input';
import { Tooltip } from '@heroui/tooltip';
import Link from 'next/link';
import { SubmitHandler, useForm } from 'react-hook-form';
import { TGetNewsByIdResponse } from 'sdk/lib/news/news.controller';
import {
	Modal,
	ModalBody,
	ModalContent,
	ModalHeader,
	useDisclosure,
} from '@heroui/modal';
import { PropsWithChildren } from 'react';
import { Primitive } from 'sdk';
import { actionPatch } from './actionPatch';
import { toast, Toaster } from 'sonner';
import { TCreateFAQBody, TGetFAQResponse } from 'sdk/lib/faq/faq.controller';
import { actionPost } from './actionPost';
import { useRouter } from 'next/navigation';
import { actionDelete } from './actionDelete';

export default function FAQForm({
	children,
	editFAQ,
	isIconOnly,
	color,
	idForDelete,
}: {
	idForDelete?: string;
	color: 'danger' | 'default';
	isIconOnly: boolean;
	editFAQ?: Primitive<TGetFAQResponse>[number];
} & PropsWithChildren) {
	const methods = useForm<TGetFAQResponse[number]>({});
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const router = useRouter();
	if (editFAQ) {
		methods.setValue('question', editFAQ.question);
		methods.setValue('answer', editFAQ.answer);
	}

	const onSubmit: SubmitHandler<TCreateFAQBody> = (data) => {
		console.log(data);
		if (editFAQ) {
			toast.promise(
				actionPatch({
					id: editFAQ.id,
					question: data.question,
					answer: data.answer,
				}),
				{
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
				},
			);
		} else {
			toast.promise(
				actionPost({
					question: data.question,
					answer: data.answer,
				}),
				{
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
				},
			);
		}
		methods.reset();
		onOpenChange();
		router.refresh();
	};

	const hadleDelete = () => {
		if (idForDelete) {
			toast.promise(actionDelete(idForDelete), {
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
		}
		router.refresh();
	};

	return (
		<>
			<Button
				isIconOnly={isIconOnly}
				onPress={idForDelete ? hadleDelete : onOpen}
				color={color}>
				{children}
			</Button>
			<Toaster />
			<Modal isOpen={isOpen} onOpenChange={onOpenChange} size={'5xl'}>
				<ModalContent>
					{() => (
						<>
							<ModalHeader className='flex flex-col gap-1'>
								{editFAQ ? 'Редактирование FAQ' : 'Добавление FAQ'}
							</ModalHeader>
							<ModalBody>
								<form
									className='max-w-7xl flex flex-col gap-3  bg-zinc-900 rounded-xl'
									onSubmit={methods.handleSubmit(onSubmit)}>
									<Input
										placeholder='Введите текст вопроса'
										label={'Введите текст вопроса'}
										labelPlacement={'outside'}
										size={'md'}
										type='text'
										{...methods.register('question')}
									/>
									<Textarea
										placeholder='Введите текст ответа'
										isClearable
										label={'Ответ на вопрос'}
										labelPlacement={'outside'}
										{...methods.register('answer')}
									/>
									<div className='flex justify-center'>
										<Button className='bg-indigo-700' type='submit'>
											Сохранить
										</Button>
									</div>
								</form>
							</ModalBody>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
}
