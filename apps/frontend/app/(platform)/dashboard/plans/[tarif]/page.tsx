import { TarifList } from '@/components/TarifCard/Tarif.list';
import TarifCardDetail from '@/components/TarifCard/TarifCardDetail/TarifCardDetail';
import { Metadata } from 'next';
import { use } from 'react';

export const metadata: Metadata = {
	title: 'ICECREAMMUSIC | Тарифы',
	description:
		'ICECREAMMUSIC - Управляйте своим творчеством, продажами и маркетингом в одном месте, чтобы сделать вашу музыку заметной и доступной миллионам слушателей!',
};

export default function DetailPlans({
	params,
}: {
	params: Promise<{ tarif: string }>;
}) {
	const { tarif } = use(params);
	const indxDetail = TarifList.findIndex((e) => e.linkDetail.includes(tarif));

	return (
		<div>
			<TarifCardDetail idxDetail={indxDetail} />
		</div>
	);
}
