import Link from 'next/link';

export default function Page404() {
	return (
		<div className='text-center h-[calc(100vh-144px)] flex flex-col items-center justify-center -mt-7'>
			<p className='text-3xl font-semibold text-white'>404</p>
			<h1 className='mt-4 text-5xl font-semibold tracking-tight text-balance text-gray-300 sm:text-7xl'>
				Страница не найдена
			</h1>
			<p className='mt-6 text-lg font-medium text-pretty text-gray-200 sm:text-xl/8'>
				Извините, мы не смогли найти страницу, которую вы ищете.
			</p>
			<div className='mt-10 flex items-center justify-center gap-x-6'>
				<Link
					href='/'
					className='rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'>
					На главную
				</Link>
				<Link
					href='https://t.me/Ckeabrona'
					className='text-sm font-semibold text-gray-300'>
					Связаться с нами <span aria-hidden='true'>&rarr;</span>
				</Link>
			</div>
		</div>
	);
}
