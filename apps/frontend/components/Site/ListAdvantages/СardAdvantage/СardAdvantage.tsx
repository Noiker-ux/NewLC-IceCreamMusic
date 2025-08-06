'use client';
import { motion } from 'framer-motion';
import style from './СardAdvantage.module.css';
import IСardAdvantage from './СardAdvanced.props';
import Image from 'next/image';

export const СardAdvantage = ({ data }: IСardAdvantage) => {
	return (
		<motion.div className={style.card} whileHover={{ y: -10 }}>
			<Image
				className={style.image}
				src={data.image}
				alt={data.altImage}
				width={32}
				height={32}
			/>
			<div className={style.text}>
				<h3 className={style.title}>{data.title}</h3>
				<p className={style.description}>{data.description}</p>
			</div>
		</motion.div>
	);
};
