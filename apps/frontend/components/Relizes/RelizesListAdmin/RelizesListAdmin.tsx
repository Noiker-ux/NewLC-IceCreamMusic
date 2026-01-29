'use client';

import { Select, SelectItem } from '@heroui/select';
import { useRouter, useSearchParams } from 'next/navigation';
import { Primitive } from 'sdk';
import { TGetReleaseListResponse } from 'sdk/lib/release/release.controller';
import { TRelease } from 'shared/schema/release.schema';
import RelizesItemAdmin from './RelizesItemAdmin/RelizesItemAdmin';

export type TRelizesListAdmin = {
	releases: Primitive<TGetReleaseListResponse['data'][number]>[];
};

const statuses: TRelease['status'][] = ['approved', 'moderating', 'rejected'];

export default function RelizesListAdmin({ releases }: TRelizesListAdmin) {
	const searchParams = useSearchParams();

	const router = useRouter();

	const currentStatus = searchParams.get('status') as TRelease['status'];

	return (
		<div className='flex flex-col gap-5 max-w-7xl'>
			<Select
				label='Выберите роль'
				labelPlacement='outside'
				radius='sm'
				defaultSelectedKeys={[currentStatus]}
				disabledKeys={[currentStatus]}
				onChange={(e) => {
					router.push(
						'?status=' + encodeURIComponent(e.target.value ?? 'moderating'),
					);
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
