import style from './ServiceItem.module.css';
import Link from 'next/link';

import Image from 'next/image';
import IService from '@/data/site/Services/Service.interface';
import { cn } from '@/utils/cn';

export const ServiceItem = ({
	countBuy,
	description,
	href,
	icon,
	listBenefit,
	price,
	timeframe,
	title,
	color = 'green',
	altIcon,
	labelButton,
	subDescription,
}: IService) => {
	return (
		<div className={style.card}>
			<div className={style.card__header}>
				<Image src={icon} alt={altIcon} width={32} height={32} />
				<div className={style.counter}>{countBuy}</div>
			</div>
			<div className={style.card__body}>
				<h3 className={style.title}>{title}</h3>
				<p
					dangerouslySetInnerHTML={{ __html: description }}
					className={style.description}></p>
				<div className={style.price__wrapper}>
					<span className={style.price}>₽{price}</span>
					<span className={style.timeframe}>&nbsp;/&nbsp;{timeframe}</span>
				</div>
				<ul className={style.benefits}>
					{listBenefit.map((benefit) => (
						<li className={style.benefis__item} key={benefit}>
							{benefit}
						</li>
					))}
				</ul>
				<div className='mt-auto flex flex-col gap-2'>
					<p
						className={style.description}
						dangerouslySetInnerHTML={{ __html: subDescription }}></p>
					<Link
						className={cn('text-center rounded-md py-2 ', {
							[style.orange]: color === 'orange',
							[style.green]: color === 'green',
							[style.purple]: color === 'purple',
						})}
						href={href}>
						{labelButton}
					</Link>
				</div>
			</div>
		</div>
	);
};
