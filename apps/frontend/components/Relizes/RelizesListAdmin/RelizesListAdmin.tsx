import actionGetRelizes from './actionGetRelizes';

import { use } from 'react';

import RelizesItemAdmin from './RelizesItemAdmin/RelizesItemAdmin';

export default function RelizesListAdmin() {
	const { data } = use(actionGetRelizes());

	return (
		<div className='flex flex-col gap-5 max-w-7xl'>
			{data.map((release) => (
				<div key={release.id}>
					<RelizesItemAdmin release={release} />
				</div>
			))}
		</div>
	);
}
