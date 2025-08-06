'use client';

import { HowItWorks } from '@/data/site/HowItWorks/HowItWorks';
import { Subtitle } from '../Subtitle/Subtitle';
import { Title } from '../Title/Title';
import { HowItWorksItem } from './HowItWorksItem/HowItWorksItem';
import style from './HowItWorksList.module.css';
import { motion } from 'framer-motion';

export const HowItWorksList = () => {
	return (
		<motion.div
			className={style.container}
			initial={{ opacity: 0, y: 160 }}
			transition={{ duration: 0.6 }}
			whileInView={{ opacity: 1, y: 0 }}>
			<div className={style.desc}>
				<Title>Как это работает?</Title>
				<Subtitle>
					6 простых шага, чтобы узнать как мы выкладываем ваш релиз на площадки
				</Subtitle>
			</div>
			<div className={style.wrapper}>
				{HowItWorks.map((item) => (
					<HowItWorksItem
						key={item.title}
						altIcon={item.altIcon}
						description={item.description}
						icon={item.icon}
						title={item.title}
					/>
				))}
			</div>
		</motion.div>
	);
};
