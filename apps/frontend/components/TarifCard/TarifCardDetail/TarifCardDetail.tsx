import { advent, agdasima } from '@/fonts/fonts';
import clsx from 'clsx';
import { TarifList } from '../Tarif.list';
import Image from 'next/image';
import Link from 'next/link';

export default function TarifCardDetail({ idxDetail }: { idxDetail: number }) {
	return (
		<div className='flex gap-5 h-min'>
			<div className='w-8/12 mobile:w-full bg-zinc-900 py-12 px-14 rounded-3xl mobile:p-8 flex flex-col gap-4'>
				<div className='flex justify-between items-center gap-5'>
					<p
						className={clsx(
							'text-[3vw] leading-[calc(100%-10px)] font-extrabold  mobile:text-3xl',
							advent.className,
						)}>
						{TarifList[idxDetail].title}
					</p>
					<div className='h-[1px] w-full bg-zinc-500'></div>
					<p
						className={clsx(
							'relative z-10 text-[2vw] mobile:text-3xl',
							agdasima.className,
						)}>
						{TarifList[idxDetail].price}
					</p>
				</div>
				<div
					className='flex flex-col w-full gap-2'
					dangerouslySetInnerHTML={{
						__html: TarifList[idxDetail].detail,
					}}></div>
				<div className='flex justify-between items-center mobile:flex-col'>
					<p className='text-zinc-500 text-xs'>
						* Совершая покупку вы подтверждаете, что ознакомились и принимаете{' '}
						<Link href={'/dashboard/docs/terms/'} className='underline'>
							условия публичной оферты
						</Link>
					</p>
					<Link href={TarifList[idxDetail].buyLink} className='btn'>
						Оформить
					</Link>
				</div>
			</div>
			<div className='w-4/12 relative mobile:hidden'>
				<Image
					className=' absolute l-0 top-0 h-full w-full object-cover rounded-3xl'
					src={TarifList[idxDetail].detailImage}
					alt={'Детальная картинка'}
					width={300}
					height={300}
				/>
			</div>
		</div>
	);
}
