'use client';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { Button } from '@heroui/button';
import { Input, Textarea } from '@heroui/input';
import {
	Modal,
	ModalBody,
	ModalContent,
	ModalHeader,
	useDisclosure,
} from '@heroui/modal';
import { Tooltip } from '@heroui/tooltip';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PropsWithChildren, useEffect, useRef, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Primitive } from 'sdk';
import {
	TGetNewsResponse,
	TUpdateNewsResponse,
} from 'sdk/lib/news/news.controller';
import {
	TUpdateNewsForm,
	updateNewsFormSchema,
} from 'shared/schema/news.schema';
import { toast, Toaster } from 'sonner';
import { actionPatch } from './actionPatch';
import { actionPost } from './actionPost';
import { TActionResult } from '@/components/Account/actionGetPersonalData';
import { revalidateTagAction } from '@/shared/api/revalidate';
import axios from 'axios';

export default function NewsForm({
	children,
	editNews,
	isIconOnly,
}: {
	isIconOnly: boolean;
	editNews?: Primitive<TGetNewsResponse>[number];
} & PropsWithChildren) {
	const methods = useForm({
		resolver: zodResolver(
			updateNewsFormSchema.extend({
				preview: !!editNews
					? updateNewsFormSchema.shape.preview.optional()
					: updateNewsFormSchema.shape.preview,
			}),
		),
		defaultValues: editNews
			? { content: editNews.content, title: editNews.title }
			: undefined,
	});
	const { isOpen, onOpen, onClose } = useDisclosure({
		onClose: () => {
			methods.reset();
		},
	});

	const [isUploading, setUploadingStatus] = useState(false);

	useEffect(() => {
		if (editNews) {
			methods.setValue('content', editNews.content);
			methods.setValue('title', editNews.title);
		}
	}, [editNews]);

	const router = useRouter();
	const refInputPreview = useRef<HTMLInputElement>(null);

	const onSubmit: SubmitHandler<{
		title: string;
		content: string;
		preview?: File | undefined;
	}> = async (data) => {
		setUploadingStatus(true);

		const submitData = {
			title: data.title,
			content: data.content,
			preview: data.preview?.name.split('.').at(-1),
		};

		let editResponse: Promise<TActionResult<TUpdateNewsResponse>>;

		if (editNews) {
			console.log('patch');
			editResponse = actionPatch(editNews.id, submitData);
		} else {
			console.log('post');
			editResponse = actionPost(submitData);
		}

		toast.promise(editResponse, {
			loading: 'Загрузка...',
			success: () => {
				return {
					message: editNews
						? 'Новость успешно изменена'
						: 'Новость успешно добавлена',
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

		const editResult = await editResponse;

		if (
			editResult.success &&
			editResult.data.preview.length > 0 &&
			data.preview
		) {
			const uploadToast = toast.info('Загружаем превью к новости');

			const result = await axios
				.put(editResult.data.preview, data.preview, {
					onUploadProgress(progress: ProgressEvent) {
						toast.loading(
							`${Math.round((progress.loaded * 100) / progress.total)}%`,
							{
								id: uploadToast,
							},
						);
					},
				})
				.then(() => true as const)
				.catch(() => false as const);

			if (result)
				toast.success('Загрузка завершена', {
					id: uploadToast,
					className: '!bg-green-300 !border-green-600 !text-green-800',
				});
			else {
				toast.error('Ошибка загрузки', {
					id: uploadToast,
					className: '!bg-red-300 !border-red-600 !text-red-800',
				});
			}
		}

		methods.reset();
		router.refresh();
		await revalidateTagAction('NewsAdmin');
		setUploadingStatus(false);
		onClose();
	};

	const previewFile = methods.watch('preview');

	return (
		<>
			<Button isIconOnly={isIconOnly} onPress={onOpen}>
				{children}
			</Button>
			<Toaster />
			<Modal
				isOpen={isOpen}
				onClose={() => !isUploading && onClose()}
				size={'5xl'}>
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
											previewFile
												? URL.createObjectURL(previewFile)
												: editNews
													? `${process.env.NEXT_PUBLIC_S3_URL}/news-previews/${editNews.id}.${editNews.preview}`
													: '/assets/emptyImage.png'
										}
										className='w-full h-96 object-cover'
										width={250}
										height={250}
										alt='Превью'
									/>
									<Button
										className='bg-indigo-700'
										type='button'
										onPress={() => {
											if (refInputPreview.current) {
												refInputPreview.current.click();
											}
										}}>
										Загрузить превью
									</Button>
									<Controller
										control={methods.control}
										name='preview'
										render={({ field }) => (
											<input
												type='file'
												accept='image/*'
												ref={refInputPreview}
												className='hidden'
												onChange={(e) => {
													if (e.target.files)
														field.onChange(Array.from(e.target.files).at(0));
												}}
											/>
										)}
									/>

									<Input
										placeholder='Введите название новости'
										label={'Название новости'}
										labelPlacement={'outside'}
										size={'md'}
										type='text'
										{...methods.register('title')}
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
										{...methods.register('content')}
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
