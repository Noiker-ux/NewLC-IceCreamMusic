import type { Metadata } from 'next';
import './globals.css';
<<<<<<< HEAD
=======
import GlobalProvider from '@/providers/Global.provider';
>>>>>>> origin/vk-auth

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
<<<<<<< HEAD
		<html lang='ru' className='h-full bg-[var(--background)]'>
			<body className={`antialiased dark`}>{children}</body>
=======
		<html lang='ru' className=' bg-[var(--background)]'>
			<head>
				<script src='https://api-maps.yandex.ru/2.1/?lang=ru_RU&load=package.full'></script>
			</head>
			<body className={`antialiased dark`}>
				<GlobalProvider>{children} </GlobalProvider>
			</body>
>>>>>>> origin/vk-auth
		</html>
	);
}
