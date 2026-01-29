'use client';
import React from 'react';
// import dynamic from 'next/dynamic';
import clsx from 'clsx';
import { advent } from '@/fonts/fonts';
import Link from 'next/link';
import { Button } from '@heroui/button';
import { FaTelegram } from 'react-icons/fa6';
import MarkqeeServices from '@/components/Markqee/MarkqeeServices/MarkqeeServices';
import TikTokCalculator from '@/components/Massposting/TikTokCalculator/TikTokCalculator';
import QueqstionList from '@/components/Massposting/QueqstionList/QueqstionList';
// import { sampleArcs, globeConfig } from './globe.settings';

// const World = dynamic(
// 	() =>
// 		import('../../../components/Massposting/Globe/Globe').then((m) => m.World),
// 	{
// 		ssr: false,
// 	},
// );

export default function MasspostingPage() {
	return (
		<div className='flex flex-col gap-10'>
			<div className='w-full h-max py-8 px-12 relative  bg-zinc-900 rounded-3xl'>
				<div className='2xl:w-1/2 relative z-10 w-full h-full'>
					<p
						className={clsx(
							'2xl:text-[6rem] 2xl:leading-[6rem] lg:text-5xl text-3xl font-extrabold',
							advent.className,
						)}>
						Продвигайте свою музыку в TikTok эффективней
					</p>
					<p className='mt-6 max-w-xl'>
						Масспостинг в TikTok — это новый маркетинговый инструмент в
						альтернативу классическому таргету. Инструмент для тех, кому нужен
						результат. Здесь и сейчас.
					</p>
				</div>
				<div className='w-full relative z-10 overflow-x-hidden'>
					<MarkqeeServices />
				</div>
				<div className='flex flex-col relative z-10 mt-5 gap-5 md:flex-row md:gap-10 '>
					<Button
						as={Link}
						className='text-slate-200'
						color='secondary'
						href='https://t.me/Ckeabrona'
						variant='solid'>
						Оформить пакет
					</Button>
					<Button
						as={Link}
						endContent={<FaTelegram />}
						color='default'
						href='https://t.me/Ckeabrona'
						variant='solid'>
						Получить консультацию
					</Button>
				</div>
				<div className='block w-full md:w-1/2 z-0 bg-transparent absolute ml-auto top-0 right-0  h-full'>
					<div className='w-full relative h-full'>
						{/* <World data={sampleArcs} globeConfig={globeConfig} /> */}
					</div>
				</div>
			</div>
			<TikTokCalculator />
			<QueqstionList />
		</div>
	);
}
