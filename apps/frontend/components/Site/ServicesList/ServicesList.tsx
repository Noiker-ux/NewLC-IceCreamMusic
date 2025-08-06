'use client';

import { Services } from '@/data/site/Services/Services';
import { Subtitle } from '../Subtitle/Subtitle';
import { Title } from '../Title/Title';
import { ServiceItem } from './ServiceItem/ServiceItem';
import style from './ServicesList.module.css';
import { motion } from 'framer-motion';
export const ServicesList = () => {
	return (
		<motion.div
			transition={{ duration: 1 }}
			initial={{ opacity: 0, y: 160 }}
			whileInView={{ opacity: 1, y: 0 }}
			className={style.container}>
			<div className={style.description}>
				<Title>Наши услуги</Title>
				<Subtitle>
					Ознакомьтесь с уловиями работы с нами! У нас есть бесплатный и платный
					тариф!
				</Subtitle>
			</div>
			<div className={style.wrapper}>
				{Services.map((Service) => (
					<ServiceItem
						key={Service.title}
						altIcon={Service.altIcon}
						countBuy={Service.countBuy}
						description={Service.description}
						href={Service.href}
						icon={Service.icon}
						labelButton={Service.labelButton}
						price={Service.price}
						title={Service.title}
						timeframe={Service.timeframe}
						listBenefit={Service.listBenefit}
						color={Service.color}
					/>
				))}
			</div>
		</motion.div>
	);
};
