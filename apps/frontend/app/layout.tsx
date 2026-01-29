import type { Metadata } from 'next';
import './globals.css';
<<<<<<< HEAD
=======
import GlobalProvider from '@/providers/Global.provider';
>>>>>>> origin/vk-auth

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
			<body className={`antialiased dark`}>
				<GlobalProvider>{children} </GlobalProvider>
			</body>
>>>>>>> origin/vk-auth
		</html>
	);
}
