'use client';
import { Slider } from '@heroui/slider';
import InfoCard from './InfoCard/InfoCard';
import { useEffect, useState } from 'react';

export default function TikTokCalculator() {
	const [viedoCount, setVideoCount] = useState(50);
	const [views, setViews] = useState(21);
	const [listeners, setListeners] = useState(430);

	useEffect(() => {
		setViews(() => {
			switch (true) {
				case viedoCount < 250:
					return viedoCount / 2 - 1;
				case viedoCount < 500:
					return viedoCount / 2 - 2;
				case viedoCount < 900:
					return viedoCount / 2 - 3;
				default:
					return viedoCount / 2 - 4;
			}
		});
		setListeners((viedoCount / 10) * 96);
	}, [viedoCount]);

	return (
		<div className='w-full flex flex-col justify-center text-center'>
			<p className='text-3xl font-bold'>Рассчитайте результат</p>
			<p className='max-w-xl mx-auto mt-3 text-xs text-foreground-400'>
				Интерактивный калькулятор поможет вам получить примерные результаты
				рекламной кампании. Даем гарантию на подсчитанный результат
			</p>
			<div className='flex flex-col md:flex-row items-center mt-10 gap-6 justify-center'>
				<InfoCard
					text={'Видео'}
					color={'#EA3C70'}
					value={viedoCount}
					valueType={'шт.'}
				/>
				<InfoCard
					text={'Просмотры'}
					color={'#0084C0'}
					value={views}
					approximately
					valueType={'K'}
				/>
				<InfoCard
					text={'Новые слушатели'}
					color={'#9353D3'}
					approximately
					value={listeners}
					valueType={''}
				/>
			</div>
			<Slider
				className='mt-10'
				defaultValue={50}
				onChange={(e) => setVideoCount(Number(e))}
				marks={[
					{
						value: 250,
						label: 'Интерес',
					},
					{
						value: 500,
						label: 'Хороший приток',
					},
					{
						value: 900,
						label: 'Заражение музыкой',
					},
				]}
				value={viedoCount}
				color='foreground'
				size='sm'
				label='Количество видео'
				maxValue={1000}
				minValue={50}
				step={10}
			/>
		</div>
	);
}
