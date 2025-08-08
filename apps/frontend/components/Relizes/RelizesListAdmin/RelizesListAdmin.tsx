'use client';

import { Primitive } from 'sdk';
import { TGetReleaseListResponse } from 'sdk/lib/release/release.controller';
import RelizesItemAdmin from './RelizesItemAdmin/RelizesItemAdmin';
import { Select, SelectItem } from '@heroui/select';
import { TRelease } from 'shared/schema/release.schema';
import { useRouter } from 'next/navigation';
import { createParser, parseAsString, useQueryState } from 'nuqs';

export type TRelizesListAdmin = {
	releases: Primitive<TGetReleaseListResponse['data'][number]>[];
};

const statuses: TRelease['status'][] = ['approved', 'moderating', 'rejected'];

const parseAsStarRating = createParser({
	parse(queryValue: unknown) {
		const isString = typeof queryValue === 'string';
		const isValid =
			isString && statuses.includes(queryValue as TRelease['status']);
		if (!isValid) return null;
		return queryValue;
	},
	serialize(value) {
		return value;
	},
});

export default function RelizesListAdmin({ releases }: TRelizesListAdmin) {
	const router = useRouter();
	const [status, setStatus] = useQueryState<TRelease['status']>(
		'status',
		parseAsStarRating.withDefault('moderating'),
	);

	return (
		<div className='flex flex-col gap-5 max-w-7xl'>
			<Select
				label='Выберите роль'
				labelPlacement='outside'
				radius='sm'
				defaultSelectedKeys={[status]}
				onChange={(e) => {
					setStatus(e.target.value as TRelease['status']);
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
