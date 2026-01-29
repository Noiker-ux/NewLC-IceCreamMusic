'use client';

import { ThemeContextSiteProvider } from '@/providers/ThemeContextSite';

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div>
			<ThemeContextSiteProvider>{children}</ThemeContextSiteProvider>
		</div>
	);
}
