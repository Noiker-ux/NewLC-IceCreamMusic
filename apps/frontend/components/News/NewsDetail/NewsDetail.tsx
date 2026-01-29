import DateFormatter from '@/utils/dateFormatter';
import { TNewsDetail } from './NewsDetail.props';
import { unstable_ViewTransition as ViewTransition } from 'react';
import { Chip } from '@heroui/chip';
import { Primitive } from 'sdk';
import { TGetNewsResponse } from 'sdk/lib/news/news.controller';
export default function NewsDetail({
	id,
	title,
	preview,
	content,
	createdAt,
}: Primitive<TGetNewsResponse>[number]) {
	return (
		<div className='flex flex-col gap-5'>
			<ViewTransition name='fade'>
				<div
					className='w-full h-96 relative bg-center rounded-xl'
					style={{
						backgroundImage: `url("${process.env.NEXT_PUBLIC_S3_URL}/news-previews/${id}.${preview}")`,
					}}></div>
			</ViewTransition>

			<div>
				<p>{DateFormatter(new Date(String(createdAt)))}</p>
				<p className='font-semibold text-3xl'>{title}</p>
				<p className='mt-3'>{content}</p>
				<div className='flex gap-3 mt-5'>
					{/* {tags.map((t) => (
						<Chip key={t}>{t}</Chip>
					))} */}
				</div>
			</div>
		</div>
	);
}
