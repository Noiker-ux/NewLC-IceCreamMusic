import RelizecCard from '@/components/Relizes/RelizesCard';
import RelizesListAdmin from '@/components/Relizes/RelizesListAdmin/RelizesListAdmin';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from '@heroui/button';
import { Tooltip } from '@heroui/tooltip';

export const dynamic = 'force-dynamic';

export default async function RealeasesAdminPage() {
	return (
		<div className='flex flex-col gap-4'>
			<h1 className='text-2xl font-bold'>Realeases Admin Page</h1>
			<RelizesListAdmin />
		</div>
	);
}
