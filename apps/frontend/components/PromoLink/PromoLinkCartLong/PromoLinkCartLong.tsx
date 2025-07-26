import { Button } from '@heroui/button';
import { Tooltip } from '@heroui/tooltip';
import {
	ArrowTopRightOnSquareIcon,
	DocumentDuplicateIcon,
	PencilSquareIcon,
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';
import PromoForm from '../PromoForm/PromoForm';

export default function PromoLinkCartLong() {
	return (
		<div className='w-full flex-col sm:flex-row  p-5  flex gap-5 bg-zinc-900 rounded-lg overflow-hidden  '>
			<Image
				src='/assets/XaQw7AVPHNY.jpg'
				alt='Обложка релиза'
				width={180}
				height={180}
				className=' object-cover m-auto sm:m-0'
			/>
			<div className='flex flex-col justify-center w-full  1.5lg:flex-row gap-5'>
				<div className='w-full flex py-5 flex-col justify-center gap-3'>
					<div>
						<p className='text-lg'>Название релиза</p>
						<p className='text-sm'>Подзаголовок релиза</p>
					</div>
					<div className='flex gap-5'>
						<div>
							<p className='text-xs font-extralight text-gray-300'>UPC</p>
							<p>5063635506441</p>
						</div>
						<div>
							<p className={'text-xs font-extralight text-gray-300'}>
								Название лейбла
							</p>
							<p className='text-sm'>ICECREAMMUSIC</p>
						</div>
					</div>
					<div className='grid grid-cols-2 sm:grid-cols-3 1.5xl:flex 1.5xl:flex-row gap-5'>
						<div>
							<p className='text-xs font-extralight text-gray-300'>
								Дата создания
							</p>
							<p className='text-sm '>2025-04-09</p>
						</div>
						<div>
							<p className='text-xs font-extralight text-gray-300'>
								Дата релиза
							</p>
							<p className='text-sm '>2025-04-11</p>
						</div>
						<div>
							<p className='text-xs font-extralight text-gray-300'>
								Дата старта
							</p>
							<p className='text-sm '>2025-04-11</p>
						</div>
						<div>
							<p className='text-xs font-extralight text-gray-300'>
								Территории
							</p>
							<p className='text-sm '>Все страны</p>
						</div>
						<div>
							<p className='text-xs font-extralight text-gray-300'>Площадки</p>
							<p className='text-sm '>56</p>
						</div>
						<div>
							<p className='text-xs font-extralight text-gray-300'>Жанр</p>
							<p className='text-sm '>Alternative Rock</p>
						</div>
					</div>
				</div>
				<div className=' mr-auto self-center flex flex-row gap-3 justify-end 1.5lg:pr-5 1.5lg:py-5 ml-0 1.5lg:ml-auto'>
					<Tooltip
						content={
							<div className='p-2'>
								<p>Создать промо-ссылку</p>
							</div>
						}>
						<PromoForm />
					</Tooltip>
					<Tooltip
						content={
							<div className='p-2'>
								<Link href={'#'}>Перейти к промо ссылке</Link>
							</div>
						}>
						<Button isIconOnly>
							<ArrowTopRightOnSquareIcon width={20} />
						</Button>
					</Tooltip>
					<Tooltip
						content={
							<div className='p-2'>
								<p>Скопировать ссылку</p>
							</div>
						}>
						<Button isIconOnly>
							<DocumentDuplicateIcon width={20} />
						</Button>
					</Tooltip>
					<Tooltip
						content={
							<div className='p-2'>
								<p>Редактировать промо-ссылку</p>
							</div>
						}>
						<Button isIconOnly>
							<PencilSquareIcon width={20} />
						</Button>
					</Tooltip>
				</div>
			</div>
		</div>
	);
}
