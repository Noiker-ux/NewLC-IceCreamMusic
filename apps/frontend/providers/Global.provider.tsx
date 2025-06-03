'use client';
import { PropsWithChildren } from 'react';
import { HeroUIProvider } from '@heroui/react';

export default function GlobalProvider({ children }: PropsWithChildren) {
	return (
		<HeroUIProvider>
			<>{children}</>
		</HeroUIProvider>
	);
}
