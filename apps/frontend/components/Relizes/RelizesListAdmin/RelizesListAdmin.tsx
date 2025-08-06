'use client';

import { Primitive } from 'sdk';
import { TGetReleaseListResponse } from 'sdk/lib/release/release.controller';
import RelizesItemAdmin from './RelizesItemAdmin/RelizesItemAdmin';
import { Select, SelectItem } from '@heroui/select';
import { TRelease } from 'shared/schema/release.schema';
import { useRouter } from 'next/navigation';

export type TRelizesListAdmin = {
	releases: Primitive<TGetReleaseListResponse['data'][number]>[];
};

const statuses: TRelease['status'][] = ['approved', 'moderating', 'rejected'];

export default function RelizesListAdmin({ releases }: TRelizesListAdmin) {
	const router = useRouter();

	return (
		<div className='flex flex-col gap-5 max-w-7xl'>
			<Select
				label='Выберите роль'
				labelPlacement='outside'
				radius='sm'
				defaultSelectedKeys={['moderating']}
				onChange={(e) => {
					router.push('?status=' + encodeURIComponent(e.target.value));
				}}
				placeholder='Выберите роль'>
				{statuses.map((status) => (
					<SelectItem key={status}>{status}</SelectItem>
				))}
			</Select>
			{releases.map((release) => (
				<div key={release.id}>
					<RelizesItemAdmin release={release} />
				</div>
			))}
		</div>
	);
}
