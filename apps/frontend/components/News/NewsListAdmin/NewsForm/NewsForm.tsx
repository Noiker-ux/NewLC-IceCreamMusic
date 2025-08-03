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
import { PropsWithChildren, useCallback, useState } from 'react';
import { TGetNewsResponse } from 'sdk/lib/news/news.controller';
import { Primitive } from 'sdk';
import Image from 'next/image';
import { useRef } from 'react';
import { actionPatch } from './actionPatch';
import { toast, Toaster } from 'sonner';
import { actionPost } from './actionPost';

export default function NewsForm({
	children,
	editNews,
	isIconOnly,
}: {
	isIconOnly: boolean;
	editNews?: Primitive<TGetNewsResponse>[number];
} & PropsWithChildren) {
	const methods = useForm<TGetNewsByIdResponse>({});
	const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
	const refInputPreview = useRef<HTMLInputElement>(null);
	const [preview, setPreview] = useState<File | null>(null);

	if (editNews) {
		methods.setValue('data', {
			...editNews,
			createdAt: editNews.createdAt ? new Date(editNews.createdAt) : null,
		});
	}

	const handleFileChange = useCallback(
		(newFiles: File[]) => {
			setPreview(newFiles.at(0) ?? null);
			methods.setValue(
				`data.preview`,
				newFiles.at(0)?.name.split('.').at(-1) ?? null,
			);
		},
		[methods],
	);

	const onSubmit: SubmitHandler<TGetNewsByIdResponse> = async (data) => {
		console.log(data);
		if (editNews) {
			console.log(data);
			toast.promise(
				actionPatch({
					id: editNews.id,
					title: data.data.title,
					content: data.data.content,
					preview: data.data.preview,
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
					title: data.data.title,
					content: data.data.content,
					preview: data.data.preview,
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
	};

	const PreviewWatch = methods.watch('data.preview');

	return (
		<>
			<Button isIconOnly={isIconOnly} onPress={onOpen}>
				{children}
			</Button>
			<Toaster />
			<Modal isOpen={isOpen} onOpenChange={onOpenChange} size={'5xl'}>
				<ModalContent>
					{() => (
						<>
							<ModalHeader className='flex flex-col gap-1'>
								Редактировать новость
							</ModalHeader>
							<ModalBody>
								<form
									className='max-w-7xl flex flex-col gap-3  bg-zinc-900 rounded-xl'
									onSubmit={methods.handleSubmit(onSubmit)}>
									<Image
										src={
											editNews
												? `${process.env.NEXT_PUBLIC_S3_URL}/news-previews/${editNews.id}.${editNews.preview}`
												: PreviewWatch && preview
													? URL.createObjectURL(preview)
													: '/assets/emptyImage.png'
										}
										className='w-full h-96 object-cover'
										width={250}
										height={250}
										alt='Превью'
									/>
									<Button
										className='bg-indigo-700'
										onPress={() => {
											if (refInputPreview.current) {
												refInputPreview.current.click();
											}
										}}>
										Загрузить превью
									</Button>
									<input
										type='file'
										accept='image/*'
										{...methods.register('data.preview')}
										ref={refInputPreview}
										className='hidden'
										onChange={(e) =>
											e.target.files &&
											handleFileChange(Array.from(e.target.files))
										}
									/>

									<Input
										placeholder='Введите название новости'
										label={'Название новости'}
										labelPlacement={'outside'}
										size={'md'}
										type='text'
										{...methods.register('data.title')}
									/>
									<Textarea
										placeholder='Введите основной текст новости'
										isClearable
										label={
											<div className='flex items-center relative gap-1 right-0 z-50'>
												<p className='text-md'>Текст новости</p>
												<Tooltip
													size='md'
													content={
														<div className='max-w-xs p-3'>
															<p>
																Внимание! Для оформления основного текста
																новости следует использовать Markdown разметку.
															</p>
															<br />
															<Link
																href='/'
																className='underline pt-5 text-indigo-400'>
																Документация Markdown
															</Link>
														</div>
													}>
													<InformationCircleIcon
														width={18}
														className='hover:text-indigo-400'
													/>
												</Tooltip>
											</div>
										}
										labelPlacement={'outside'}
										{...methods.register('data.content')}
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
