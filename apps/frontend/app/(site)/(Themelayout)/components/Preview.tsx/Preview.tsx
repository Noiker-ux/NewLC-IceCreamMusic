'use client';

import style from './Preview.module.css';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
export const Preview = () => {
	return (
		<motion.div
			className={style.preview__wrapper}
			initial={{ opacity: 0, y: 60 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 1 }}>
			<div className={style.text}>
				<h1 className={style.title}>Все для артиста в одном месте</h1>
				<p className={style.description}>
					Управляйте своим творчеством, продажами и маркетингом в одном месте,
					чтобы сделать вашу музыку заметной и доступной миллионам слушателей!
				</p>
				<div className={style.links}>
					<motion.div
						className={style.log_wrap}
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}>
						<Link className={style.login} href={'/auth/signin'}>
							Вход в аккаунт
						</Link>
					</motion.div>
					<Link className={style.more} href={'/auth/signin'}>
						Узнать больше
					</Link>
				</div>
			</div>
			<Image
				style={{ objectFit: 'contain', maxWidth: '48rem' }}
				src={'/assets/site_assets/novinki.png'}
				className={style.image}
				width={740}
				height={740}
				alt='Новинки'
			/>
		</motion.div>
	);
};
