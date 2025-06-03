'use client';
import StudiosPreview from './StudiosPreview/StudiosPreview';
import { cn } from '@/utils/cn';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Mousewheel, Parallax, FreeMode, Autoplay } from 'swiper/modules';
import style from './StudioDetail.module.css';
import 'swiper/css';
import Image from 'next/image';
import StudioAbout from './StudioAbout/StudioAbout';
import StudiosTeam from './StudiosTeam/StudiosTeam';
export default function StudioDetail() {
	const people = [
		{
			name: 'Leslie Alexander',
			role: 'Co-Founder / CEO',
			imageUrl: '/photo_2025-04-28_15-07-23.jpg',
			location: 'Toronto, Canada',
		},
		// More people...
	];
	return (
		<>
			<StudiosPreview
				bgImage={'black-mamba-snake-pale-gray-spots-val4upfryn4ad5ac.jpg'}
				logo={'photo_2025-05-18_20-30-50.jpg'}
				mainColor={''}
			/>
			<StudioAbout />
			<div className='text-4xl mb-20 font-semibold max-h-[75vh] tracking-tight text-pretty text-white sm:text-5xl overflow-hidden'>
				<h2
					className={cn(
						'mb-12 text-4xl font-semibold tracking-tight text-pretty text-white sm:text-5xl',
					)}>
					Фотографии студии:
				</h2>
				<Swiper
					modules={[Mousewheel, Parallax, FreeMode, Autoplay]}
					freeMode={true}
					spaceBetween={50}
					parallax={true}
					breakpoints={{
						0: {
							slidesPerView: 2.5,
						},
						680: {
							slidesPerView: 3.5,
						},
					}}>
					<div className={cn(style['slider__wrapper'])}>
						<SwiperSlide className={cn(style['slider__item'])}>
							<Image
								src={'/assets/Studios/photo_2025-05-18_20-30-47.jpg'}
								alt=''
								width={500}
								height={500}
								className={style['slider__img']}
							/>
						</SwiperSlide>
						<SwiperSlide className={cn(style['slider__item'])}>
							<Image
								src={'/assets/Studios/photo_2025-05-18_20-30-49 (2).jpg'}
								alt=''
								width={500}
								height={500}
								className={style['slider__img']}
							/>
						</SwiperSlide>
						<SwiperSlide className={cn(style['slider__item'])}>
							<Image
								src={'/assets/Studios/photo_2025-05-18_20-30-49.jpg'}
								alt=''
								width={500}
								height={500}
								className={style['slider__img']}
							/>
						</SwiperSlide>
						<SwiperSlide className={cn(style['slider__item'])}>
							<Image
								src={'/assets/Studios/photo_2025-05-18_20-30-48.jpg'}
								alt=''
								width={500}
								height={500}
								className={style['slider__img']}
							/>
						</SwiperSlide>
					</div>
				</Swiper>
			</div>
			<StudiosTeam
				losung={
					' Showbiz Records состоит из квалифицированных специалистов высшего уровня'
				}
				people={people}
			/>
		</>
	);
}
