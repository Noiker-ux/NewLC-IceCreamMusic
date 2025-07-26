'use client';
import DateFormatter from '@/utils/dateFormatter';
import {
	EyeIcon,
	PencilSquareIcon,
	TrashIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@heroui/button';
import { Tooltip } from '@heroui/tooltip';
import Image from 'next/image';
import { TGetNewsResponse } from 'sdk/lib/news/news.controller';
import { Primitive } from 'sdk';
import Link from 'next/link';
import { createSDKConnection } from '@/shared/lib/config/sdk';
import { action } from './actionDelete';
import {
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	useDisclosure,
} from '@heroui/modal';
import NewsForm from './NewsForm/NewsForm';

export default function NewsCardAdmin({
	newsItem,
}: {
	newsItem: Primitive<TGetNewsResponse>[number];
}) {
	const { id, title, preview, content, createdAt } = newsItem;
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const deleteNews = async () => {
		await action(id);
	};

	return (
		<div className='max-w-7xl flex flex-col md:flex-row gap-5 p-5 bg-zinc-900 rounded-xl cursor-pointer'>
			<Image
				src={`${process.env.NEXT_PUBLIC_S3_URL}/news-previews/${id}.${preview}`}
				alt='Admin News Page'
				width={200}
				height={200}
				className='w-full md:w-[150px] md:h-[150px] object-cover'
			/>
			<div>
				<div className='flex flex-col-reverse md:flex-row justify-between gap-5'>
					<div>
						<p className='text-sm text-zinc-500'>
							{DateFormatter(new Date(String(createdAt)))}
						</p>
						<h1 className='text-lg md:text-2xl'>{title}</h1>
					</div>
					<div>
						<div className='flex gap-2'>
							<Tooltip
								content={
									<div className='p-2'>
										<p>Посмотреть полностью</p>
									</div>
								}>
								<Button isIconOnly as={Link} href={`/admin/news/${id}`}>
									<EyeIcon width={20} />
								</Button>
							</Tooltip>
							<Tooltip
								content={
									<div className='p-2'>
										<p>Редактировать</p>
									</div>
								}>
								<Button isIconOnly onPress={onOpen}>
									<PencilSquareIcon width={20} />
								</Button>
							</Tooltip>
							<Tooltip content={<div className='p-2'>Удалить новость</div>}>
								<Button
									isIconOnly
									color='danger'
									onPress={() => {
										deleteNews();
									}}>
									<TrashIcon width={20} />
								</Button>
							</Tooltip>
						</div>
					</div>
				</div>
				<p className='mt-1 line-clamp-4 overflow-hidden'>{content}</p>
			</div>
			<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
				<ModalContent>
					{() => (
						<>
							<ModalHeader className='flex flex-col gap-1'>
								Редактировать новость
							</ModalHeader>
							<ModalBody>
								<NewsForm />
							</ModalBody>
						</>
					)}
				</ModalContent>
			</Modal>
		</div>
	);
}
