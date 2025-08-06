import { Primitive } from 'sdk';
import { TGetReleaseListResponse } from 'sdk/lib/release/release.controller';
import RelizesItemAdmin from './RelizesItemAdmin/RelizesItemAdmin';

export type TRelizesListAdmin = {
	releases: Primitive<TGetReleaseListResponse['data'][number]>[];
};

export default function RelizesListAdmin({ releases }: TRelizesListAdmin) {
	return (
		<div className='flex flex-col gap-5 max-w-7xl'>
			{releases.map((release) => (
				<div key={release.id}>
					<RelizesItemAdmin release={release} />
				</div>
			))}
		</div>
	);
}
