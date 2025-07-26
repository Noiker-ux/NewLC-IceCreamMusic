import type { Metadata } from 'next';
import './globals.css';
import GlobalProvider from '@/providers/Global.provider';

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='ru' className=' bg-[var(--background)]'>
			<body className={`antialiased dark`}>
				<GlobalProvider>{children} </GlobalProvider>
			</body>
		</html>
	);
}
