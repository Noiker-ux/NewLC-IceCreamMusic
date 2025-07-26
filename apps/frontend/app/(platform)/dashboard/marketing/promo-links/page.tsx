import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import PromoLinkCartLong from '@/components/PromoLink/PromoLinkCartLong/PromoLinkCartLong';
import { Input } from '@heroui/input';

export default function PromoLinksPage() {
	return (
		<div>
			<div className='flex gap-3 max-w-2xl'>
				<div className='bg-indigo-700 py-3 h-fit px-6 rounded-lg'>Релизы</div>
				<Input
					size='lg'
					type='text'
					startContent={<MagnifyingGlassIcon width={20} />}
					placeholder='Поиск по названию, исполнителю, UPC '
				/>
			</div>
			<div className='mt-5 flex flex-col gap-5'>
				<PromoLinkCartLong />
				<PromoLinkCartLong />
				<PromoLinkCartLong />
				<PromoLinkCartLong />
				<PromoLinkCartLong />
				<PromoLinkCartLong />
			</div>
		</div>
	);
}
