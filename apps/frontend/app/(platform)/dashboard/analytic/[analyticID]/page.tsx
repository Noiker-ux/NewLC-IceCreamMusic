import { actionGetAnalyticById } from '@/components/Analytic/CardAnalytic/actionGetAnalyticById';
import DateFormatter from '@/utils/dateFormatter';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'ICECREAMMUSIC | Аналитика',
	description:
		'ICECREAMMUSIC - Управляйте своим творчеством, продажами и маркетингом в одном месте, чтобы сделать вашу музыку заметной и доступной миллионам слушателей!',
};

export default async function Page({
	params,
}: {
	params: Promise<{ analyticID: string }>;
}) {
	const { analyticID } = await params;
	const analytic = await actionGetAnalyticById({ analyticsId: analyticID });

	return (
		<>
			{analytic.success && (
				<>
					<p>
						{DateFormatter(new Date(analytic.data.data.periodStart))} -{' '}
						{DateFormatter(new Date(analytic.data.data.periodFinish))}
					</p>
					<div className='w-full h-96 mt-5'>
						<div>
							<div
								dangerouslySetInnerHTML={{
									__html: analytic.data.data.flourishReportMarkup,
								}}></div>
						</div>
					</div>
				</>
			)}
		</>
	);
}
