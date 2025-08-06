'use client';
import { ThemeContextSite } from '@/providers/ThemeContextSite';
import style from './CardStore.module.css';

import { motion } from 'framer-motion';
import { useContext } from 'react';
import IStore from '@/data/site/Stores/Stores.interface';
import Image from 'next/image';

export const CardStore = ({ image, alt, alternativeImage }: IStore) => {
	const { theme } = useContext(ThemeContextSite);

	return (
		<motion.div className={style.card}>
			<Image
				className={style.image}
				alt={alt}
				src={theme == 'dark' ? image : alternativeImage}
				width={225}
				height={80}
			/>
		</motion.div>
	);
};
