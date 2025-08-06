import { advent, agdasima } from '@/fonts/fonts';
import clsx from 'clsx';
import { FaRegCheckCircle } from 'react-icons/fa';
import { TTarifItem } from './TarifCard.props';

import MoneyFormatter from '@/utils/moneyFormatter';
import Link from 'next/link';

export default function TarifCard({ tarifItem }: TTarifItem) {
	const {
		subtitle,
		title,
		description,
		videoSrc,
		listAdvantage,
		price,
		linkDetail,
		buyLink,
	} = tarifItem;

	return (
		<div className='relative bg-zinc-900 h-full w-full rounded-3xl py-12 px-14 mobile:p-8'>
			<video
				className='absolute brightness-50  z-10 top-0 left-0 w-full rounded-3xl h-full object-cover mobile:hidden'
				autoPlay
				muted
				loop>
				<source src={videoSrc} type='video/mp4' />
			</video>
			<div className='w-full'>
				<div className='relative flex flex-col z-20'>
					<div className='flex justify-between mobile:flex-col-reverse'>
						<div className='flex flex-col mobile:gap-2'>
							<p className='mobile:hidden'>{subtitle}</p>
							<p
								className={clsx(
									'text-[6vw] leading-[calc(100%-10px)] font-extrabold  mobile:text-3xl',
									advent.className,
								)}>
								{title}
							</p>
						</div>
						<div>
							<p
								className={clsx(
									'relative z-10 text-[3vw] mobile:text-3xl',
									agdasima.className,
								)}>
								{MoneyFormatter(price)}
							</p>
						</div>
					</div>
					<div className='flex justify-between'>
						<div className='flex flex-col w-full'>
							<p className=' mt-2 '>{description}</p>
							<ul
								className={clsx(
									'mt-3 grid gap-5 gap-x-4 w-fit',
									listAdvantage.length > 3 && 'grid-cols-2 mobile:grid-cols-1',
								)}>
								{listAdvantage.map((advantage) => (
									<li key={advantage} className='relative  pl-3 ml-3'>
										<FaRegCheckCircle className='absolute -left-3 top-1' />{' '}
										{advantage}
									</li>
								))}
							</ul>
						</div>
					</div>
					<div className='flex gap-4 mt-3 mobile:flex-col'>
						<Link className='btn' href={linkDetail}>
							Подробнее
						</Link>
						<Link className='btn' href={buyLink}>
							Оформить
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
