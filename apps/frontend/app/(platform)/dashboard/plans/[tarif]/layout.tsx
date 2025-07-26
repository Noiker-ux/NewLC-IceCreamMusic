import MarkqeeServices from '@/components/Markqee/MarkqeeServices/MarkqeeServices';
import TarifTable from '@/components/TarifCard/TarifTable/TarifTable';
import { PropsWithChildren } from 'react';

export default function LayoutDetailPlans({ children }: PropsWithChildren) {
	return (
		<div className='flex flex-col gap-3'>
			{children}
			<MarkqeeServices />
			<TarifTable />
		</div>
	);
}
