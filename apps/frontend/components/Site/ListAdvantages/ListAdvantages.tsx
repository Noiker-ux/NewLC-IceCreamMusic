'use client';

import { СardAdvantage } from './СardAdvantage/СardAdvantage';
import style from './ListAdvantages.module.css';
import { Title } from '../Title/Title';
import { motion } from 'framer-motion';
import { Advantages } from '@/data/site/Advantages/Advantages';
export const ListAdvantages = () => {
	return (
		<motion.div
			className={style.wrap}
			initial={{ opacity: 0, y: 160 }}
			transition={{ duration: 0.6 }}
			whileInView={{ opacity: 1, y: 0 }}>
			<Title>Наши преимущества</Title>
			<div className={style.advantages}>
				{Advantages.map((Advantage) => (
					<СardAdvantage key={Advantage.title} data={Advantage} />
				))}
			</div>
		</motion.div>
	);
};
