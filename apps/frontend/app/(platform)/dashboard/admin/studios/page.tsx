import StudioForm from '@/components/Studios/StudioForm/StudioForm';
import YMap from '@/components/Studios/StudiosDetail/StudioMap/StudioMap';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'ICECREAMMUSIC | Админ панель Студии',
	description:
		'ICECREAMMUSIC - Управляйте своим творчеством, продажами и маркетингом в одном месте, чтобы сделать вашу музыку заметной и доступной миллионам слушателей!',
};

export default function AdminStudioPage() {
	return (
		<div>
			<YMap />
			<StudioForm />
		</div>
	);
}
