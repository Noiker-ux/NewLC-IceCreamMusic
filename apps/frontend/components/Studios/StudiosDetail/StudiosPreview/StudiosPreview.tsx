import { advent } from '@/fonts/fonts';
import { cn } from '@/utils/cn';
import Image from 'next/image';
import { useExtractColors } from 'react-extract-colors';
import { unstable_ViewTransition as ViewTransition } from 'react';

type TStudiosPreview = {
	bgImage?: string;
	logo: string;
	name: string;
};

export default function StudiosPreview({
	bgImage,
	logo,
	name,
}: TStudiosPreview) {
	const { dominantColor, darkerColor, lighterColor } = useExtractColors(logo);

	return (
		<div
			className=' py-12 lg:py-24 bg-no-repeat w-full bg-cover'
			style={{
				backgroundImage: `url("${bgImage ? bgImage : logo}")`,
				boxShadow: '0px 0px 30px 20px #0a0a0a inset',
			}}>
			<div className='flex justify-center items-center '>
				<div className='relative max-w-[500px] '>
					<ViewTransition name='studioTransit'>
						<Image
							src={logo}
							alt={'da'}
							width={500}
							height={500}
							className='relative flex justify-between  rounded-full w-[500px] h-[500px] object-cover'
						/>
					</ViewTransition>
					<div
						className={cn(
							'absolute left-0 top-0  max-w-[500px] w-full max-h-[500px] h-full rounded-full py-5 px-7 bg-transparent border-3 ',
						)}
						style={{
							boxShadow: `0 0 7px 0 ${darkerColor}, 0 0 5px 2px ${dominantColor}, inset 0 0 40px 0 ${dominantColor}, inset 0 0 5px 1px ${dominantColor}`,
						}}></div>
				</div>
			</div>
			<h1
				className={cn(
					'text-7xl font-semibold text-center py-20',
					advent.className,
				)}>
				{name}
			</h1>
		</div>
	);
}
