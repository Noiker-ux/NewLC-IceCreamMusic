import VerificationForm from '@/components/Verification/VerificationForm/VerificationForm';

export default function VerificationPage() {
	return (
		<div className='w-full flex flex-col xl:flex-row flex-row gap-8'>
			<div className='bg-zinc-900 w-full p-8 rounded-xl xl:w-3/4  '>
				<VerificationForm />
			</div>
			<div className='flex w-full xl:w-1/4 flex-col gap-5'>
				<div className='bg-zinc-900 rounded-xl p-8'>
					<p className='text-3xl font-extrabold'>Зачем?</p>
					<ul>
						<li>
							Верификация позволяет обеспечить корректность представления данных
							об исполнителе.
						</li>
						<li>
							Проверка документов и другой информации позволяет предотвратить
							мошенничество и незаконное использование чужих данных.
						</li>
						<li>Мы шифруем данные, согласно стандарту T3DS</li>
						<li>
							Верификация позволяет обеспечить корректность представления данных
							об исполнителе.
						</li>
						<li>Мы шифруем данные, согласно стандарту T3DS</li>
					</ul>
				</div>
				<div className='bg-zinc-900 rounded-xl p-8'>
					<p className='text-3xl font-extrabold'>Остались вопросы?</p>
					<p className='mt-3'>
						Если у вас остались вопросы по верификации или если вы хотите скорее
						узнать статус процесса верификации, можете написать нам в чате.
						Среднее время верификации 24 часа
					</p>
				</div>
			</div>
		</div>
	);
}
