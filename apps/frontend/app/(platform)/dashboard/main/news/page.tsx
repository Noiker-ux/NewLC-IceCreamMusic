import NewsList from '@/components/News/NewsList';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'ICECREAMMUSIC | Новости',
	description:
		'ICECREAMMUSIC - Управляйте своим творчеством, продажами и маркетингом в одном месте, чтобы сделать вашу музыку заметной и доступной миллионам слушателей!',
};

export const dynamic = 'force-dynamic';

export default function NewsPage() {
	return <NewsList />;
}
