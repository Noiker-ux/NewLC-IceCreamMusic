'use client';
import { cn } from '@/utils/cn';
import Image from 'next/image';
import { TStudioPhotoData } from 'sdk/lib/studio/studio.controller';
import 'swiper/css';
import { Autoplay, FreeMode, Mousewheel, Parallax } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import style from './StudioPhotos.module.css';

export type TStudioPhotos = {
	photos: TStudioPhotoData[];
};

export default function StudioPhotos({ photos }: TStudioPhotos) {
	return (
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
				{photos.map((photo) => (
					<SwiperSlide key={photo.id} className={cn(style['slider__item'])}>
						<Image
							src={photo.url}
							alt={photo.name}
							width={500}
							height={500}
							className={style['slider__img']}
						/>
					</SwiperSlide>
				))}
			</div>
		</Swiper>
	);
}
