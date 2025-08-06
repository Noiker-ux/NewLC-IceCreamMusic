import { FooterData } from '@/data/site/FooterLinks/FooterLinks';
import { Logo } from '../Logo/Logo';
import style from './Footer.module.css';

import Link from 'next/link';

export const Footer = () => {
	return (
		<footer className={style.footer}>
			<Logo />
			<div className={style.menu}>
				{FooterData.data.map((FooterSection) => (
					<div className={style.columnFooter} key={FooterSection.title}>
						<h3 className={style.footerTitle}>{FooterSection.title}</h3>
						{FooterSection.block.map((FooterItem) => (
							<Link
								className={style.footerLink}
								key={FooterItem.href}
								href={FooterItem.href}>
								{FooterItem.label}
							</Link>
						))}
					</div>
				))}
			</div>
		</footer>
	);
};
