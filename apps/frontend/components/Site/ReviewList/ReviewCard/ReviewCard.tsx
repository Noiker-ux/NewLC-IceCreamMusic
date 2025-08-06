import getFirstSymbol from '@/utils/getFirstSymbol';
import style from './ReviewCard.module.css';
import IReviews from '@/data/site/Reviews/Reviews.interface';

export const ReviewCard = ({ name, review_text, role }: IReviews) => {
	const avatar = getFirstSymbol(name);
	return (
		<div className={style.card}>
			<div className={style.header}>
				<p className={style.avatar}>{avatar}</p>
				<div className={style.user}>
					<p className={style.name}>{name}</p>
					<p className={style.role}>{role}</p>
				</div>
			</div>
			<div className={style.body}>
				<p className={style.desc}>{review_text}</p>
			</div>
		</div>
	);
};
