import { TarifList } from '@/components/TarifCard/Tarif.list';
import TarifCard from '@/components/TarifCard/TarifCard';
import Image from 'next/image';

export default function PlansPage() {
	return (
		<div className='flex flex-col gap-5 w-full'>
			<TarifCard tarifItem={TarifList[0]} />
			<TarifCard tarifItem={TarifList[1]} />
			<div className='flex gap-5 h-min'>
				<div className='w-8/12 mobile:w-full'>
					<TarifCard tarifItem={TarifList[2]} />
				</div>
				<div className='w-4/12 relative mobile:hidden'>
					<Image
						src={'/assets/Tarifs/photo_5319064615684010758_y.jpg'}
						alt={''}
						width={500}
						height={500}
						className=' absolute l-0 top-0 h-full w-full object-cover rounded-3xl'
					/>
				</div>
			</div>
		</div>
	);
}
