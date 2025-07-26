import Image from 'next/image';
import { TDownLoadFile } from './DownLoadFile.props';
import getIcon from './getFormatIcon';

export default function DownLoadFile({
	tag,
	title,
	description,
	href,
}: TDownLoadFile) {
	return (
		<a href={href}>
			<div className='mb-5 border-2 py-5 flex gap-4 px-6 rounded-lg bg-slate-400 mobile:text-xs mobile:p-3'>
				<Image
					className='self-start mobile:w-10'
					src={`/assets/Formats/${getIcon(href)}.svg`}
					alt={`${getIcon(href)}Icon`}
					width={50}
					height={30}
				/>
				<div className='flex flex-col gap-1'>
					<div className='flex items-center gap-2 mobile:flex-col mobile:items-start'>
						{tag && (
							<p className='bg-slate-600 w-min h-min px-3 text-sm min-w-14 mobile:text-xs'>
								{tag}
							</p>
						)}
						<p className='font-bold'>{title}</p>
					</div>
					<p>{description}</p>
				</div>
			</div>
		</a>
	);
}
