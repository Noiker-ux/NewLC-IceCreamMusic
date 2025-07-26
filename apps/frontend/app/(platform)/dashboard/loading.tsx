export default function Loading() {
	return (
		<div className='w-full h-[calc(100vh-144px)] flex justify-center items-center'>
			<div
				className='load1 absolute w-52 h-52 border-2 border-zinc-300 rounded-full'
				style={{
					borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70% ',
				}}></div>{' '}
			<div
				className='load2 absolute w-52 h-52 border-2 border-zinc-300 rounded-full'
				style={{ borderRadius: '72% 28% 24% 76% / 69% 61% 39% 31%  ' }}></div>
			<div
				className='load3 absolute w-52 h-52 border-2 border-zinc-300 rounded-full'
				style={{ borderRadius: '85% 15% 65% 35% / 33% 67% 33% 67%  ' }}></div>
			<p className='text-2xl'>Загрузка</p>
		</div>
	);
}
