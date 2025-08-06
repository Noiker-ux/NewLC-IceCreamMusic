import { ReactNode } from 'react';
import style from './Subtitle.module.css';

export const Subtitle = ({ children }: { children: ReactNode }) => {
	return <p className={style.subtitle}>{children}</p>;
};
