import NewsDetail from '@/components/News/NewsDetail/NewsDetail';
import { createSDKConnection } from '@/shared/lib/config/sdk';
import { Metadata } from 'next';
import { functional } from 'sdk';

export const metadata: Metadata = {
	title: 'ICECREAMMUSIC | Новости',
	description:
		'ICECREAMMUSIC - Управляйте своим творчеством, продажами и маркетингом в одном месте, чтобы сделать вашу музыку заметной и доступной миллионам слушателей!',
};

export const dynamic = 'force-dynamic';

const connection = createSDKConnection({
	next: {
		tags: ['News'],
	},
});

export default async function NewsDetailPage({
	params,
}: {
	params: Promise<{ detail: string }>;
}) {
	const newsDetail = await functional.api.v1.news.getNewsById(
		connection,
		(await params).detail,
	);

	return (
		<>
			<NewsDetail
				id={newsDetail.data.id}
				title={newsDetail.data.title}
				preview={newsDetail.data.preview}
				content={newsDetail.data.content}
				createdAt={newsDetail.data.createdAt}
				// tags={newsDetail.data.tags}
			/>
		</>
	);
}
