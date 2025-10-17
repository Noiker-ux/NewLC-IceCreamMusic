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
import { PropsWithChildren, useEffect, useRef } from 'react';
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
			const uploadToast = toast('Загружаем превью к новости');

			const totalBytes = data.preview.size;

			let uploaded = 0;

			const progressTrackingStream = new TransformStream({
				transform(chunk, controller) {
					controller.enqueue(chunk);
					uploaded += chunk.byteLength;

					toast(`${Math.round(uploaded / totalBytes)}%`, {
						id: uploadToast,
					});
				},
				flush() {
					toast.success(`${Math.round(uploaded / totalBytes)}%`, {
						id: uploadToast,
					});
				},
			});

			await fetch(editResult.data.preview, {
				method: 'PUT',
				body: data.preview.stream().pipeThrough(progressTrackingStream),
				duplex: 'half',
				headers: {
					'Content-Type': 'application/octet-stream',
					'Content-Length': String(totalBytes),
				},
			} as RequestInit);
		}

		methods.reset();
		router.refresh();
		await revalidateTagAction('NewsAdmin');
		onClose();
	};

	const previewFile = methods.watch('preview');

	return (
		<>
			<Button isIconOnly={isIconOnly} onPress={onOpen}>
				{children}
			</Button>
			<Toaster />
			<Modal isOpen={isOpen} onClose={onClose} size={'5xl'}>
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
