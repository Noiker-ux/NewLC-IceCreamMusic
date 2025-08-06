'use client';

import IStatistic from '@/data/site/Statistics/Statistics.interface';
import style from './StatistiicItem.module.css';
import { motion } from 'framer-motion';
export const StatisticItem = ({ count, label }: IStatistic) => {
	return (
		<motion.div whileHover={{ y: -10 }} className={style.StatistiicItem}>
			<h2 className={style.count}>{count}</h2>
			<p className={style.label}>{label}</p>
		</motion.div>
	);
};
