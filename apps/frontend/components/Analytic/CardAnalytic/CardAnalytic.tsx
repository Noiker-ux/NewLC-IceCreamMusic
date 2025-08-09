'use client';
import DateFormatter from '@/utils/dateFormatter';
import { Button } from '@heroui/button';
import { Primitive } from 'sdk';
import { TGetAnalyticsResponse } from 'sdk/lib/analytics/analytics.controller';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Tooltip } from '@heroui/tooltip';
import { actionDeleteAnalytic } from './actionDeleteAnalytic';
import FormAnalytic from '../FormAnalytic/FormAnalytic';

export default function CardAnalytic({
	analytic,
}: {
	analytic: Primitive<TGetAnalyticsResponse['data']>;
}) {
	return (
		<div className='bg-zinc-900 p-5 rounded-xl'>
			<div className='flex justify-between'>
				<p>
					Период статистики: {DateFormatter(new Date(analytic.periodStart))} -{' '}
					{DateFormatter(new Date(analytic.periodFinish))}
				</p>
				<div className='flex items-center gap-2'>
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
				</div>
			</div>
		</div>
	);
}
