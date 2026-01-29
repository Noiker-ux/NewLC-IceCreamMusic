'use client';
import { PropsWithChildren } from 'react';
import { HeroUIProvider, ToastProvider } from '@heroui/react';

export default function GlobalProvider({ children }: PropsWithChildren) {
	return (
		<HeroUIProvider>
			<ToastProvider placement='bottom-right' />
			{children}
		</HeroUIProvider>
	);
}
