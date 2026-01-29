import PriorityRelease from '@/components/PriorityRelease/PriorityRelease';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'ICECREAMMUSIC | Приоритетный релиз',
	description:
		'ICECREAMMUSIC - Управляйте своим творчеством, продажами и маркетингом в одном месте, чтобы сделать вашу музыку заметной и доступной миллионам слушателей!',
};

export default function PriorityReleasePage() {
	return (
		<>
			<PriorityRelease />
		</>
	);
}
