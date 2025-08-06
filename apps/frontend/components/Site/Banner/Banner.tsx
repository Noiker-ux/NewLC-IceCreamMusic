'use client';
import Link from 'next/link';
import style from './Banner.module.css';
import IBannerProps from './Banner.props';
import { motion } from 'framer-motion';

export const Banner = ({
	info,
	fromColor = '#5355C5',
	toColor = '#1FA151',
}: IBannerProps) => {
	return (
		<div
			className={style.banner}
			style={{
				background: `linear-gradient(to right, ${fromColor}, ${toColor})`,
			}}>
			<div className={style.text}>
				<h3 className={style.title}>{info.title}</h3>
				<p className={style.description}>{info.description}</p>
			</div>
			<motion.div
				className={style.href_wrap}
				whileHover={{ scale: 1.05 }}
				whileTap={{ scale: 0.95 }}>
				<Link className={style.href} href={info.href}>
					{info.hrefLabel}
				</Link>
			</motion.div>
		</div>
	);
};
