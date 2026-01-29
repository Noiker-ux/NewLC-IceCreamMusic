'use client';
import Link from 'next/link';
import { Logo } from '../Logo/Logo';
import style from './Header.module.css';
import { ToggleTheme } from '../ToggleTheme/ToggleTheme';
import { useState } from 'react';
import { cn } from '@/utils/cn';

export const Header = () => {
	const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);

	return (
		<header className={style.header}>
			<div className={style.content}>
				<Logo className={style.header__logo} />
				<div
					className={cn(style.right_panel, style.mobile__menu, {
						[style.showMobileMenu]: showMobileMenu,
					})}>
					<nav className={style.nav}>
						<ul className={style.menu__list}>
							<li
								className={style.menu__item}
								onClick={() => {
									setShowMobileMenu(false);
								}}>
								<Link className={style.menu__link} href={'/'}>
									Главная
								</Link>
							</li>
							<li
								className={style.menu__item}
								onClick={() => {
									setShowMobileMenu(false);
								}}>
								<Link className={style.menu__link} href={'/distribution'}>
									Дистрибуция
								</Link>
							</li>
							<li
								className={style.menu__item}
								onClick={() => {
									setShowMobileMenu(false);
								}}>
								<Link className={style.menu__link} href={'/platforms'}>
									Платформы
								</Link>
							</li>
							<li
								className={style.menu__item}
								onClick={() => {
									setShowMobileMenu(false);
								}}>
								<Link className={style.menu__link} href={'/questions'}>
									Вопросы
								</Link>
							</li>
						</ul>
					</nav>
					<div className={style.addons}>
						{/* <ToggleTheme /> */}
						<Link href={'/auth/signin'}>Вход в аккаунт</Link>
					</div>
				</div>
				<button
					className={style.hamburger}
					onClick={() => {
						setShowMobileMenu(!showMobileMenu);
					}}>
					<div
						className={cn(style.line, {
							[style.activeMenu]: showMobileMenu,
						})}></div>
				</button>
			</div>
		</header>
	);
};
