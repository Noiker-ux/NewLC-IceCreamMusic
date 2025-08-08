'use client';
import { PropsWithChildren } from 'react';
import { HeroUIProvider, ToastProvider } from '@heroui/react';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

export default function GlobalProvider({ children }: PropsWithChildren) {
	return (
		<HeroUIProvider>
			<ToastProvider placement='bottom-right' />
			<NuqsAdapter>{children}</NuqsAdapter>
		</HeroUIProvider>
	);
}
