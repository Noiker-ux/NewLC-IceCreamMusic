import Link from 'next/link';

import { TGetNewsResponse } from 'sdk/lib/news/news.controller';
import { Primitive } from 'sdk';
import { unstable_ViewTransition as ViewTransition } from 'react';

export default function NewsAnons({
	newsItem,
}: {
	newsItem: Primitive<TGetNewsResponse>[number];
}) {
	const { id, title, preview } = newsItem;

	return (
		<Link href={'/main/news/' + id}>
			<ViewTransition name={`fade-${newsItem.id}`}>
				<div
					className={`relative  w-full min-h-52 md:min-h-96 bg-zinc-900 rounded-2xl  bg-no-repeat bg-cover bg-center cursor-pointer  transition-all hover:scale-95`}
					style={{
						backgroundImage: `url("${process.env.NEXT_PUBLIC_S3_URL}/news-previews/${id}.${preview}")`,
					}}>
					<div className='absolute top-5 left-5 '>
						<p className='font-extrabold text-xl inline-block'>{title}</p>
					</div>
				</div>
			</ViewTransition>
		</Link>
	);
}
