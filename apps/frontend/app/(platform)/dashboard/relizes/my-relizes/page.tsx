import RelizesList from '@/components/Relizes/RelizesList';

export const dynamic = 'force-dynamic';

export default function MyRelizesPage() {
	return (
		<div className='flex flex-col gap-5 max-w-7xl'>
			<RelizesList />
		</div>
	);
}
