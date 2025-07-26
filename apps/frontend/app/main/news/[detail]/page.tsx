import NewsDetail from '@/components/News/NewsDetail/NewsDetail';
import { createSDKConnection } from '@/shared/lib/config/sdk';
import { functional, Primitive } from 'sdk';
import { TGetNewsByIdResponse } from 'sdk/lib/news/news.controller';

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
	const newsDetail = await functional.v1.news.getNewsById(
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
