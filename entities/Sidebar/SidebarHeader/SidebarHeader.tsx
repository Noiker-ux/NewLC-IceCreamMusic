'use client';
import Logo from '@/shared/Logo/Logo';
import style from './SidebarHeader.module.css';
import { useContext } from 'react';
import { SidebarContext } from '@/context/SidebarContext';
import classNames from 'classnames';

const SidebarHeader = () => {
	const { size } = useContext(SidebarContext);

	return (
		<div className={style.header}>
			<Logo />
			<div
				className={classNames(style.text, { [style.small]: size === 'small' })}>
				<p className={style.title}>IceCreamMusic</p>
				<p className={style.description}>Все для артиста в одном месте.</p>
			</div>
		</div>
	);
};

export default SidebarHeader;
