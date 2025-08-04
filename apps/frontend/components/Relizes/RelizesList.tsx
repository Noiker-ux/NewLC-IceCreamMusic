import { actionGetMyRelizes } from './actionGetMyRelizes';
import RelizecCard from './RelizesCard';

export default async function RelizesList() {
	const arrRelizes = await actionGetMyRelizes();
	return (
		<div className='flex flex-col gap-5'>
			{arrRelizes.data.map((relize) => (
				<div key={relize.id}>
					<RelizecCard release={relize} />
				</div>
			))}
		</div>
	);
}
