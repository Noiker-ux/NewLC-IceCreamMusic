import PromoLinkCartLong from '@/components/PromoLink/PromoLinkCartLong/PromoLinkCartLong';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'ICECREAMMUSIC | Новая промо-ссылка',
	description:
		'ICECREAMMUSIC - Управляйте своим творчеством, продажами и маркетингом в одном месте, чтобы сделать вашу музыку заметной и доступной миллионам слушателей!',
};

export default function newPromo() {
	return (
		<div className='max-w-7xl'>
			<PromoLinkCartLong />
		</div>
	);
}
