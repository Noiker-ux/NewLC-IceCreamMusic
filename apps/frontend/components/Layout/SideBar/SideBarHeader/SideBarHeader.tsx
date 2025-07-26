import Image from 'next/image';

export default function SideBarHeader() {
	return (
		<div className='flex gap-3 h-16 shrink-0 items-center'>
			<Image
				width={32}
				height={32}
				alt='ICECREAMMUSIC'
				src='/assets/Logo.svg'
				className='w-auto'
			/>
			<div>
				<p className='font-bold'>ICECREAMMUSIC</p>
				<p className='text-xs'>Лучший дистрибьютор музыки</p>
			</div>
		</div>
	);
}
