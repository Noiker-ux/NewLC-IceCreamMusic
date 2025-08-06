'use client';

import { Stores } from '@/data/site/Stores/Stores';
import { Subtitle } from '../Subtitle/Subtitle';
import { Title } from '../Title/Title';
import { CardStore } from './CardStore/CardStore';
import style from './ListStores.module.css';
import { motion } from 'framer-motion';

export const ListStores = () => {
	return (
		<div className={style.wrap}>
			<div className={style.description}>
				<Title>Основные площадки</Title>
				<Subtitle>
					6 простых шага, чтобы узнать как мы выкладываем ваш релиз на площадки
				</Subtitle>
			</div>
			<div className={style.storesWrapper}>
				{Stores.map((store, idx: number) => (
					<motion.div
						transition={{ delay: 0.1 * idx }}
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						key={store.alt}>
						<CardStore
							alt={store.alt}
							image={store.image}
							alternativeImage={store.alternativeImage}
						/>
					</motion.div>
				))}
				<motion.div
					transition={{ delay: 0.7 }}
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					className={style.cardMore}>
					И ещё 240 площадок
				</motion.div>
			</div>
		</div>
	);
};
