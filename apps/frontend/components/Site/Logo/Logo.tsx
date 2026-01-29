import Link from 'next/link';
import style from './Logo.module.css';

import ILogo from './Logo.props';
import { cn } from '@/utils/cn';
import Image from 'next/image';

export const Logo = ({ className }: ILogo) => {
	return (
		<Link href={'/'}>
			<Image
				className={cn(className, style.logo)}
				alt='ICECREAMMUSIC логотип'
				src={'/assets/site_assets/logo.png'}
				width={100}
				height={100}
			/>
		</Link>
	);
};
