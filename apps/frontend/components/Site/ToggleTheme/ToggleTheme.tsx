import { useContext } from 'react';

import style from './ToggleTheme.module.css';
import Image from 'next/image';
import { ThemeContextSite } from '@/providers/ThemeContextSite';

export const ToggleTheme = () => {
	const { theme, setTheme } = useContext(ThemeContextSite);
	return (
		<button
			className={style.switch}
			onClick={() => {
				if (theme === 'dark') {
					setTheme('light');
				} else {
					setTheme('dark');
				}
			}}>
			<Image
				src={
					theme === 'light'
						? '/assets/site_assets/theme/sun.png'
						: '/assets/site_assets/theme/moon.png'
				}
				width={20}
				height={20}
				className={theme === 'dark' ? style.dark : style.light}
				alt='ThemeIcon'
			/>
		</button>
	);
};
