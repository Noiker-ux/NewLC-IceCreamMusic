import { cn } from '@/utils/cn';
import style from './page.module.css';

import { Metadata } from 'next';
import Image from 'next/image';
import { HowItWorksList } from '@/components/Site/HowItWorksList/HowItWorksList';
import { ListStores } from '@/components/Site/ListStores/ListStores';
import { ReviewList } from '@/components/Site/ReviewList/ReviewList';
import { Banner } from '@/components/Site/Banner/Banner';
import { BannerIntresting } from '@/data/site/BannerIntresting/BannerIntresting';

export const metadata: Metadata = {
	title: 'ICECREAMMUSIC | Дистрибуция',
	description: `
		ICECREAMMUSIC - Дистрибуция музыки - это процесс распространения музыкальных
		композиций и альбомов от исполнителей и музыкальных групп к
		слушателям. В цифровую эпоху дистрибуция музыки в основном связана с
		распространением аудиофайлов или потоковой передачей музыки через
		интернет.`,
};

export default function Home() {
	return (
		<main className='main'>
			<div className={cn(style.preview, 'previewBG')}>
				<h1 className={style.title}>Что такое дистрибуция?</h1>
				<div className={style.block}>
					<p className={style.text}>
						Дистрибуция музыки - это процесс распространения музыкальных
						композиций и альбомов от исполнителей и музыкальных групп к
						слушателям. В цифровую эпоху дистрибуция музыки в основном связана с
						распространением аудиофайлов или потоковой передачей музыки через
						интернет.
					</p>
					<Image
						className={style.preview__image}
						src={'/assets/site_assets/music.png'}
						width={80}
						height={80}
						alt='Иконка ноты'
					/>
				</div>
			</div>
			<HowItWorksList />
			<ListStores />
			<ReviewList />
			<Banner info={BannerIntresting} />
		</main>
	);
}
