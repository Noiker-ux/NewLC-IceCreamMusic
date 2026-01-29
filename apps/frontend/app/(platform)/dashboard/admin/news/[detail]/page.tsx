import NewsDetail from '@/components/News/NewsDetail/NewsDetail';
import { createSDKConnection } from '@/shared/lib/config/sdk';
import { functional } from 'sdk';
import { checkUserAdmin } from '../../checkUserAdmin';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'ICECREAMMUSIC | Админ панель Новости',
	description:
		'ICECREAMMUSIC - Управляйте своим творчеством, продажами и маркетингом в одном месте, чтобы сделать вашу музыку заметной и доступной миллионам слушателей!',
};

export const dynamic = 'force-dynamic';

const connection = createSDKConnection({
	next: {
		tags: ['News'],
	},
});

export default async function NewsDetailPageAdmin({
	params,
}: {
	params: Promise<{ detail: string }>;
}) {
	await checkUserAdmin();

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
