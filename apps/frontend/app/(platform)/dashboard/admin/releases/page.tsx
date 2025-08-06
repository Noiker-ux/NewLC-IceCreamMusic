import actionGetRelizes from '@/components/Relizes/RelizesListAdmin/actionGetRelizes';
import RelizesListAdmin from '@/components/Relizes/RelizesListAdmin/RelizesListAdmin';
import { Select, SelectItem } from '@heroui/select';
import { TRelease } from 'shared/schema/release.schema';

export const dynamic = 'force-dynamic';

const statuses: TRelease['status'][] = ['approved', 'moderating', 'rejected'];

export default async function RealeasesAdminPage({
	searchParams,
}: {
	searchParams: Promise<{ status?: TRelease['status'] }>;
}) {
	const { status } = await searchParams;

	const { data } = await actionGetRelizes(status);

	return (
		<div className='flex flex-col gap-4'>
			<h1 className='text-2xl font-bold'>Realeases Admin Page</h1>
			<Select
				label='Выберите роль'
				labelPlacement='outside'
				radius='sm'
				defaultSelectedKeys={['Исполнитель']}
				placeholder='Выберите роль'>
				{statuses.map((status) => (
					<SelectItem key={status}>{status}</SelectItem>
				))}
			</Select>
			<RelizesListAdmin releases={data} />
		</div>
	);
}
