'use client';
import Link from 'next/link';
import { SidebarLinks } from './SidebarBody.links';
import style from './SidebarBody.module.css';
import { useContext } from 'react';
import { SidebarContext } from '@/context/SidebarContext';
import classNames from 'classnames';

const SidebarBody = () => {
	const { size } = useContext(SidebarContext);
	return (
		<nav className={style.nav}>
			<ul className={style.linkList}>
				{SidebarLinks.map((linkItem) => (
					<li key={linkItem.href} className={style.linkItem}>
						<Link
							className={classNames(style.link, {
								[style.fixPadding]: size === 'small',
							})}
							href={linkItem.href}>
							<div className={style.icon}>{linkItem.icon}</div>
							<span
								className={classNames(style.label, {
									[style.small]: size === 'small',
								})}>
								{linkItem.label}
							</span>
						</Link>
					</li>
				))}
			</ul>
		</nav>
	);
};
export default SidebarBody;
