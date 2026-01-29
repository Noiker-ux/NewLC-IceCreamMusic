import { ListStores } from '@/components/Site/ListStores/ListStores';
import style from './page.module.css';

import { Metadata } from 'next';
import { FAQ } from '@/components/Site/FAQ/FAQ';
import { ReviewList } from '@/components/Site/ReviewList/ReviewList';
import { Banner } from '@/components/Site/Banner/Banner';
import { FAQ_data } from '@/data/site/FAQ/FAQ';
import { BannerIntresting } from '@/data/site/BannerIntresting/BannerIntresting';

export const metadata: Metadata = {
	title: 'ICECREAMMUSIC | Платформы',
	description:
		'ICECREAMMUSIC - Основные площадки. Мы предоставляем большой выбор популярных площадок! Делись своим творчеством со всем миром и будь услышанным!',
};

export default function Home() {
	return (
		<main className='main'>
			<div className={style.preview}>
				<h1 className={style.title}>Основные площадки</h1>
				<p className={style.text}>
					Мы предоставляем большой выбор популярных площадок! Делись своим
					творчеством со всем миром и будь услышанным!
				</p>
			</div>
			<ListStores />
			<FAQ
				FAQ_data={FAQ_data.filter((item) => {
					return item.important;
				})}
			/>

			<ReviewList />
			<Banner info={BannerIntresting} />
		</main>
	);
}
