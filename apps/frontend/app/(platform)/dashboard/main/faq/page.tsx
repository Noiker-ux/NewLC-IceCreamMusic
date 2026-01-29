import FAQList from '@/components/FAQ/FAQList/FAQ';
import { agdasima } from '@/fonts/fonts';
import { FaTelegramPlane } from 'react-icons/fa';
import { FaVk } from 'react-icons/fa';
import { RiWhatsappFill } from 'react-icons/ri';
import { FaViber } from 'react-icons/fa6';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'ICECREAMMUSIC | FAQ',
	description:
		'ICECREAMMUSIC - Управляйте своим творчеством, продажами и маркетингом в одном месте, чтобы сделать вашу музыку заметной и доступной миллионам слушателей!',
};

export const dynamic = 'force-dynamic';
export default function FAQPage() {
	return (
		<div className='flex flex-col gap-3'>
			<div className='relative bg-gradient-to-r rounded-2xl from-[#EA3C70] to-[#0084C0] py-10 px-2'>
				<p
					className={`${agdasima.className} font-bold text-[4vw] text-center my-text big:text-3xl mobile:hidden`}>
					-- FREQUENTLY ASKED QUESTIONS --
				</p>
				<p className='absolute top-0 bottom-0 m-auto text-center flex justify-center items-center left-0 right-0 text-3xl font-extrabold mobile:relative'>
					Часто задаваемые вопросы
				</p>
			</div>
			<FAQList />
			<div className='w-full flex gap-4 bg-zinc-900 rounded-2xl p-5'>
				<div className='w-9/12 mobile:w-full'>
					<p className='text-[2vw] font-bold mobile:text-2xl'>
						Не нашли ответа на нужный вопрос?
					</p>
					<p>
						Вы можете задать интересующий Вас вопрос, прямо на нашей площадке в
						разделе - Поддержка или в социальных сетях:
					</p>
					<ul className='mt-3 flex flex-col gap-2'>
						<li className='flex gap-3 items-center'>
							<FaTelegramPlane size={30} fill='#27a7e7' />
							<a href='https://t.me/ICECREAMMUSICSUPPORTBOT'>
								https://t.me/ICECREAMMUSICSUPPORTBOT
							</a>
						</li>
						<li className='flex gap-3 items-center'>
							<FaVk size={30} fill='#4d7198' />
							<a href='https://vk.com/icecreammusicru'>
								https://vk.com/icecreammusicru
							</a>
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
}
