import StudiosPreview from './StudiosPreview/StudiosPreview';
import { cn } from '@/utils/cn';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Mousewheel, Parallax, FreeMode, Autoplay } from 'swiper/modules';
import style from './StudioDetail.module.css';
import 'swiper/css';
import Image from 'next/image';
import StudioAbout from './StudioAbout/StudioAbout';
import StudiosTeam from './StudiosTeam/StudiosTeam';
import { TCompleteStudioData } from 'sdk/lib/studio/studio.controller';
export default function StudioDetail({
	studio,
}: {
	studio: TCompleteStudioData;
}) {
	return (
		<>
			<StudiosPreview
				bgImage={`${process.env.NEXT_PUBLIC_S3_URL}/studio-backgrounds/${studio.id}.${studio.background}`}
				logo={`${process.env.NEXT_PUBLIC_S3_URL}/studios/${studio.id}.${studio.logo}`}
				name={studio.name}
			/>
			<StudioAbout
				name={studio.name}
				description={studio.description}
				anotation={studio.annotation}
				studioPhotos={studio.photos}
				stats={studio.stats}
			/>
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
						{studio.photos.map((photo) => (
							<SwiperSlide key={photo.id} className={cn(style['slider__item'])}>
								<Image
									src={`${process.env.NEXT_PUBLIC_S3_URL}/studio-photos/${photo.id}.${
										photo.url
									}`}
									alt=''
									width={500}
									height={500}
									className={style['slider__img']}
								/>
							</SwiperSlide>
						))}
					</div>
				</Swiper>
			</div>
			{studio.team.length > 0 && <StudiosTeam people={studio.team} />}
		</>
	);
}
