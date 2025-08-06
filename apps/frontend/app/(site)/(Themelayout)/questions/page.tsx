import { Metadata } from 'next';

import style from './page.module.css';
import { FAQ } from '@/components/Site/FAQ/FAQ';
import { ListStores } from '@/components/Site/ListStores/ListStores';
import { ReviewList } from '@/components/Site/ReviewList/ReviewList';
import { Banner } from '@/components/Site/Banner/Banner';
import { FAQ_data } from '@/data/site/FAQ/FAQ';
import { BannerIntresting } from '@/data/site/BannerIntresting/BannerIntresting';

export const metadata: Metadata = {
	title: 'ICECREAMMUSIC | Вопросы',
	description: 'ICECREAMMUSIC - Часто задаваемые вопросы',
};

export default function Home() {
	return (
		<main className='main'>
			<div className={style.preview}>
				<h1 className={style.title}>Часто задаваемые вопросы</h1>
				<p className={style.text}>
					Здесь вы найдете ответ на интересующий вас вопрос!
				</p>
			</div>
			<FAQ FAQ_data={FAQ_data} />
			<ListStores />
			<ReviewList />
			<Banner info={BannerIntresting} />
		</main>
	);
}
