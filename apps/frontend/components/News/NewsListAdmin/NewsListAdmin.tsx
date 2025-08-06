import { createSDKConnection } from '@/shared/lib/config/sdk';
import NewsCardAdmin from './NewsCardAdmin/NewsCardAdmin';
import { TGetNewsResponse } from 'sdk/lib/news/news.controller';
import { functional, Primitive } from 'sdk';
import { Button } from '@heroui/button';
import Link from 'next/link';
import NewsForm from './NewsForm/NewsForm';

const connection = createSDKConnection({
	next: {
		tags: ['NewsAdmin'],
	},
});
export default async function NewsListAdmin() {
	const newsData: Primitive<TGetNewsResponse> =
		await functional.v1.news.getNews(connection, {
			page: 1,
			size: 1000,
		});
	return (
		<div>
			<NewsForm isIconOnly={false}>Добавить новость</NewsForm>
			<div className='flex flex-col gap-3'>
				{newsData.map((news) => (
					<div key={news.id}>
						<NewsCardAdmin newsItem={news} />
					</div>
				))}
			</div>
		</div>
	);
}
