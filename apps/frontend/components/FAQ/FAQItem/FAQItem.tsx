import { TGetFAQResponse } from 'sdk/lib/faq/faq.controller';

export default function FAQItem({
	FAQItem,
}: {
	FAQItem: TGetFAQResponse[number];
}) {
	const { question, answer } = FAQItem;

	return (
		<div className='relative bg-zinc-900 h-full rounded-xl p-5 cursor-pointer hover:bg-zinc-800 after:absolute after:left-0 after:rounded-full after:top-0 after:w-1 after:h-full after:bg-gradient-to-b after:from-[#5a9868] after:to-[#bdf17a]'>
			<div className='flex justify-between'>
				<p className='font-bold'>{question}</p>
			</div>
			<p className='mt-2'>{answer}</p>
		</div>
	);
}
