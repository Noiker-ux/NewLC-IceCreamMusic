import StudiosList from '@/components/Studios/StudiosList/StudiosList';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'ICECREAMMUSIC | Студии звукозаписи',
	description:
		'ICECREAMMUSIC - Управляйте своим творчеством, продажами и маркетингом в одном месте, чтобы сделать вашу музыку заметной и доступной миллионам слушателей!',
};

export const dynamic = 'force-dynamic';

export default function Page() {
	return (
		<div>
			<StudiosList />
		</div>
	);
}
