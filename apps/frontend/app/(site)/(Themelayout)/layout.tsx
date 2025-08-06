'use client';

import { useContext } from 'react';

import { Rubik } from 'next/font/google';
import { ThemeContextSite } from '@/providers/ThemeContextSite';
import { Header } from '@/components/Site/Header/Header';
import { Footer } from '@/components/Site/Footer/Footer';

const rubik = Rubik({ subsets: ['latin'] });

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const { theme } = useContext(ThemeContextSite);
	return (
		<div data-theme={theme} className={rubik.className}>
			<div className='container'>
				<Header />
				{children}
				<Footer />
			</div>
		</div>
	);
}
