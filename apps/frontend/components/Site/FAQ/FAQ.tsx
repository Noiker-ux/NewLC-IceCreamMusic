'use client';

import IFAQ from '@/data/site/FAQ/FAQ.interface';
import { Title } from '../Title/Title';
import style from './FAQ.module.css';
import { FAQ__item } from './FAQ__item/FAQ__item';
import { motion } from 'framer-motion';
export const FAQ = ({ FAQ_data }: { FAQ_data: IFAQ[] }) => {
	return (
		<div className={style.wrap}>
			<Title>Часто задаваемые вопросы</Title>
			<div className={style.faq}>
				{FAQ_data.map((FAQ_item, idx) => (
					<motion.div
						transition={{ delay: 0.1 * idx }}
						initial={{ opacity: 0, y: 60 }}
						whileInView={{ opacity: 1, y: 0 }}
						key={FAQ_item.question}>
						<FAQ__item
							question={FAQ_item.question}
							answer={FAQ_item.answer}
							important={FAQ_item.important}
						/>
					</motion.div>
				))}
			</div>
		</div>
	);
};
