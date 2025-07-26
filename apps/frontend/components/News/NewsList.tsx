import clsx from 'clsx';
import NewsAnons from './NewsAnons/NewsAnons';
import { createSDKConnection } from '@/shared/lib/config/sdk';
import { TGetNewsResponse } from 'sdk/lib/news/news.controller';
import { functional, Primitive } from 'sdk';

const connection = createSDKConnection({
	next: {
		tags: ['News'],
	},
});

export default async function NewsList() {
	const newsData: Primitive<TGetNewsResponse> =
		await functional.v1.news.getNews(connection, {
			page: 1,
			size: 10,
		});

	return (
		<div className='grid  gap-x-5 gap-y-5 grid-cols-1 md:grid-cols-4'>
			{newsData.map((newsItem, idx) => (
				<div
					key={newsItem.id}
					className={clsx('', idx % 6 === 0 && 'md:col-span-3')}>
					<NewsAnons newsItem={newsItem} />
				</div>
			))}
		</div>
	);
}
