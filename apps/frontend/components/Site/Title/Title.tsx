import { ReactNode } from 'react';
import style from './Title.module.css';
export const Title = ({ children }: { children: ReactNode }) => {
	return <h1 className={style.title}>{children}</h1>;
};
