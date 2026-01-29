import PromotionList from '@/components/Promotion/PromotionList/PromotionList';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'ICECREAMMUSIC | Промоушен',
	description:
		'ICECREAMMUSIC - Управляйте своим творчеством, продажами и маркетингом в одном месте, чтобы сделать вашу музыку заметной и доступной миллионам слушателей!',
};

export default function PromotionPage() {
	return (
		<>
			<PromotionList />
		</>
	);
}
