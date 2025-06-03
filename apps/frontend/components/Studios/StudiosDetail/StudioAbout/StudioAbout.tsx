import Image from 'next/image';

export default function StudioAbout() {
	return (
		<div className='overflow-hidden  py-24 sm:py-32'>
			<div className='mx-auto'>
				<div className='max-w-4xl'>
					<p className='text-base/7 font-semibold text-wite'>О студии</p>
					<h1 className='mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-100 sm:text-5xl'>
						Showbiz Records
					</h1>
					<p className='mt-6 text-xl/8 text-balance text-gray-200'>
						Наша команда более б лет на рынке и мы успели познакомиться и
						поработать с большим количеством артистов, наши композиторы написали
						музыку во множество фильмов и сериалов.
						<br />
						<br />
						Огромный опыт, атмосфера при работе и цель достичь лучших
						результатов- это наше преимущество!
					</p>
				</div>
				<section className='mt-20 grid grid-cols-1 lg:grid-cols-2 lg:gap-x-8 lg:gap-y-16'>
					<div className='lg:pr-8'>
						<h2 className='text-2xl font-semibold tracking-tight text-pretty text-gray-100'>
							3 причины выбрать нас
						</h2>
						<p className='mt-6 text-base/7 text-gray-200'>
							<span className='text-white font-bold'>Качество</span>
							<br />
							Профессиональное оборудование. Опыт и оборудование наших
							специалистов позволяют делать контент по всем канонам высшего
							уровня индустрии.
						</p>
						<p className='mt-8 text-base/7 text-gray-200'>
							<span className='text-white font-bold'>Сроки</span>
							<br />
							Пока конкуренты спят-мы работаем. Работаем 24/7,ценим Ваше время и
							оптимизируем производственные процессы индивидуально под каждый
							запрос.
						</p>
						<p className='mt-8 text-base/7 text-gray-200'>
							<span className='text-white font-bold'>Современность</span>
							<br />
							Мы знаем как сделать Ваш контент актуальным, а не проходным.
							Современные методы производства контента и знание правил индустрии
							позволяют нам поддерживать и увеличивать узнаваемость
							бренда/артиста в индустрии.
						</p>
					</div>
					<div className='pt-16 lg:row-span-2 lg:-mr-16 xl:mr-auto'>
						<div className='-mx-8 grid grid-cols-2 gap-4 sm:-mx-16 sm:grid-cols-4 lg:mx-0 lg:grid-cols-2 lg:gap-4 xl:gap-8'>
							<div className='aspect-square overflow-hidden rounded-xl shadow-xl outline-1 -outline-offset-1 outline-black/10'>
								<Image
									src={'/assets/Studios/photo_2025-05-18_20-30-49 (2).jpg'}
									alt=''
									width={350}
									height={350}
									className='block size-full object-cover'
								/>
							</div>
							<div className='-mt-8 aspect-square overflow-hidden rounded-xl shadow-xl outline-1 -outline-offset-1 outline-black/10 lg:-mt-40'>
								<Image
									src={'/assets/Studios/photo_2025-05-18_20-30-49.jpg'}
									alt=''
									width={350}
									height={350}
									className='block size-full object-cover'
								/>
							</div>
							<div className='aspect-square overflow-hidden rounded-xl shadow-xl outline-1 -outline-offset-1 outline-black/10'>
								<Image
									src={'/assets/Studios/photo_2025-05-18_20-30-48.jpg'}
									alt=''
									width={350}
									height={350}
									className='block size-full object-cover'
								/>
							</div>
							<div className='-mt-8 aspect-square overflow-hidden rounded-xl shadow-xl outline-1 -outline-offset-1 outline-black/10 lg:-mt-40'>
								<Image
									src={'/assets/Studios/photo_2025-05-18_20-30-47.jpg'}
									alt=''
									width={350}
									height={350}
									className='block size-full object-cover'
								/>
							</div>
						</div>
					</div>
					<div className='max-lg:mt-16 lg:col-span-1'>
						<p className='text-base/7 font-semibold text-gray-100'>
							Наши цифры
						</p>
						<hr className='mt-6 border-t border-gray-200' />
						<dl className='mt-6 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2'>
							<div className='flex flex-col gap-y-2 border-b border-dotted border-gray-200 pb-4'>
								<dt className='text-sm/6 text-gray-300'>Произведенных песен</dt>
								<dd className='order-first text-6xl font-semibold tracking-tight'>
									<span>1000</span>
								</dd>
							</div>
							<div className='flex flex-col gap-y-2 border-b border-dotted border-gray-200 pb-4'>
								<dt className='text-sm/6 text-gray-300'>Лет на рынке</dt>
								<dd className='order-first text-6xl font-semibold tracking-tight'>
									<span>6</span>
								</dd>
							</div>
							<div className='flex flex-col gap-y-2'>
								<dt className='text-sm/6 text-gray-300'>Наш рейтинг</dt>
								<dd className='order-first text-6xl font-semibold tracking-tight'>
									<span>4.8</span>
								</dd>
							</div>
							<div className='flex flex-col gap-y-2 max-sm:border-b max-sm:border-dotted max-sm:border-gray-200 max-sm:pb-4'>
								<dt className='text-sm/6 text-gray-300'>
									Стримов наших клиентов
								</dt>
								<dd className='order-first text-6xl font-semibold tracking-tight'>
									<span>10</span>M
								</dd>
							</div>
						</dl>
					</div>
				</section>
			</div>
		</div>
	);
}
