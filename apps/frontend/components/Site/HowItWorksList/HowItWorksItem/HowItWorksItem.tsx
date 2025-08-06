import Image from 'next/image';
import style from './HowItWorksItem.module.css';
import IHowItWorks from '@/data/site/HowItWorks/HowItWorks.interface';

export const HowItWorksItem = ({
	altIcon,
	description,
	icon,
	title,
}: IHowItWorks) => {
	return (
		<div className={style.item}>
			<Image
				className={style.icon}
				src={icon}
				alt={altIcon}
				width={30}
				height={30}
			/>
			<h3 className={style.title}>{title}</h3>
			<p className={style.description}>{description}</p>
		</div>
	);
};
