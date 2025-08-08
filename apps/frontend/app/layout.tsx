import type { Metadata } from 'next';
import './globals.css';
import GlobalProvider from '@/providers/Global.provider';

export const metadata: Metadata = {
	title: 'ICECREAMMUSIC',
	description:
		'ICECREAMMUSIC - Управляйте своим творчеством, продажами и маркетингом в одном месте, чтобы сделать вашу музыку заметной и доступной миллионам слушателей!',
};

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
