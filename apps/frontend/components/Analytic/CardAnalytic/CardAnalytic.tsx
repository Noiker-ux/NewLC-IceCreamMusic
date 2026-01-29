'use client';
import DateFormatter from '@/utils/dateFormatter';
import { Button } from '@heroui/button';
import { Primitive } from 'sdk';
import { TGetAnalyticsResponse } from 'sdk/lib/analytics/analytics.controller';
import {
	EyeIcon,
	PencilSquareIcon,
	TrashIcon,
} from '@heroicons/react/24/outline';
import { Tooltip } from '@heroui/tooltip';
import { Link } from '@heroui/link';
import { actionDeleteAnalytic } from './actionDeleteAnalytic';
import FormAnalytic from '../FormAnalytic/FormAnalytic';
import { usePathname, useRouter } from 'next/navigation';

export default function CardAnalytic({
	analytic,
	adminkey,
}: {
	analytic: Primitive<TGetAnalyticsResponse['data']>;
	adminkey: boolean | undefined;
}) {
	const router = useRouter();
	const pathName = usePathname();
	return (
		<div className='bg-zinc-900 p-5 rounded-xl'>
			<div className='flex justify-between'>
				<p>
					Период статистики: {DateFormatter(new Date(analytic.periodStart))} -{' '}
					{DateFormatter(new Date(analytic.periodFinish))}
				</p>
				<div className='flex items-center gap-2'>
					<Tooltip content={<div className='p-2'>Посмотреть</div>}>
						<Button
							isIconOnly
							startContent={<EyeIcon width={20} />}
							onPress={() => {
								router.push(pathName.split('/').at(-1) + '/' + analytic.id);
							}}
						/>
					</Tooltip>
					{adminkey && (
						<>
							<Tooltip content={<div className='p-2'>Редактировать</div>}>
								<FormAnalytic userId={analytic.userId} analytic={analytic}>
									<PencilSquareIcon width={20} />
								</FormAnalytic>
							</Tooltip>
							<Tooltip content={<div className='p-2'>Удалить</div>}>
								<Button
									isIconOnly
									color='danger'
									onPress={() => {
										actionDeleteAnalytic({ analyticsId: analytic.id });
									}}
									startContent={<TrashIcon width={20} />}></Button>
							</Tooltip>
						</>
					)}
				</div>
			</div>
		</div>
	);
}
