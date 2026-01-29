'use client';

import { Reviews } from '@/data/site/Reviews/Reviews';
import { Subtitle } from '../Subtitle/Subtitle';
import { Title } from '../Title/Title';
import { ReviewCard } from './ReviewCard/ReviewCard';
import style from './ReviewList.module.css';
import { motion } from 'framer-motion';
export const ReviewList = () => {
	return (
		<motion.div
			initial={{ opacity: 0, y: 160 }}
			transition={{ duration: 0.6 }}
			whileInView={{ opacity: 1, y: 0 }}
			className={style.wrap}>
			<div className={style.text}>
				<Title>Впечатления артистов</Title>
				<Subtitle>Отзывы артистов о нашем сервисе</Subtitle>
			</div>
			<div className={style.review__list}>
				{Reviews.map((review) => (
					<ReviewCard
						name={review.name}
						review_text={review.review_text}
						role={review.role}
						key={review.review_text}
					/>
				))}
			</div>
		</motion.div>
	);
};
