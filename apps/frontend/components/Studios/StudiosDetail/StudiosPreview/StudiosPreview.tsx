import { advent } from '@/fonts/fonts';
import { cn } from '@/utils/cn';
import Image from 'next/image';
import { useExtractColors } from 'react-extract-colors';

type TStudiosPreview = {
	bgImage: string;
	logo: string;
	mainColor: string;
};

export default function StudiosPreview({ bgImage, logo }: TStudiosPreview) {
	const { dominantColor, darkerColor, lighterColor } = useExtractColors(
		'/Studios/' + logo,
	);
	console.log('dominantColor', dominantColor);
	console.log('darkerColor', darkerColor);
	console.log('lighterColor', lighterColor);
	return (
		<div
			className=' py-12 lg:py-24 bg-no-repeat w-full bg-cover'
			style={{
				backgroundImage: `url("/Studios/${bgImage}")`,
				boxShadow: '0px 0px 30px 20px #0a0a0a inset',
			}}>
			<div className='flex justify-center items-center '>
				<div className='relative max-w-[500px] '>
					<Image
						src={`/assets/Studios/${logo}`}
						alt={'da'}
						width={500}
						height={500}
						className='relative flex justify-between w-full rounded-full'
					/>
					<div
						className={cn(
							'absolute left-0 top-0  max-w-[500px] w-full max-h-[500px] h-full rounded-full py-5 px-7 bg-transparent border-3 border-[#f3eaff]',
						)}
						// style={{
						// 	boxShadow:
						// 		'0 0 7px 0 #14fae7, 0 0 5px 2px #0ca174, inset 0 0 40px 0 #50eeb2, inset 0 0 5px 1px #05e6da',
						// }}relative bg-gradient-to-r rounded-2xl from-[#EA3C70] to-[#0084C0] py-10 px-2
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
				Showbiz Records
			</h1>
		</div>
	);
}
