import { TarifList } from '@/components/TarifCard/Tarif.list';
import TarifCardDetail from '@/components/TarifCard/TarifCardDetail/TarifCardDetail';
import { use } from 'react';

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
