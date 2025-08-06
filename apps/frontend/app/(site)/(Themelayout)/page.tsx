import { Metadata } from 'next';
import { Preview } from './components/Preview.tsx/Preview';
import { ListAdvantages } from '@/components/Site/ListAdvantages/ListAdvantages';
import { ListStores } from '@/components/Site/ListStores/ListStores';
import { ServicesList } from '@/components/Site/ServicesList/ServicesList';
import { HowItWorksList } from '@/components/Site/HowItWorksList/HowItWorksList';
import { FAQ } from '@/components/Site/FAQ/FAQ';
import { StatisticList } from '@/components/Site/StatisticList/StatisticList';
import { Banner } from '@/components/Site/Banner/Banner';
import { BannerIntresting } from '@/data/site/BannerIntresting/BannerIntresting';
import { FAQ_data } from '@/data/site/FAQ/FAQ';

export const metadata: Metadata = {
	title: 'ICECREAMMUSIC | Главная',
	description:
		'ICECREAMMUSIC - Управляйте своим творчеством, продажами и маркетингом в одном месте, чтобы сделать вашу музыку заметной и доступной миллионам слушателей!',
};

export default function Home() {
	return (
		<main className='main'>
			<Preview />
			<HowItWorksList />
			<ListAdvantages />
			<ListStores />
			<ServicesList />
			<FAQ
				FAQ_data={FAQ_data.filter((item) => {
					return item.important;
				})}
			/>

			<StatisticList />

			<Banner info={BannerIntresting} />
		</main>
	);
}
