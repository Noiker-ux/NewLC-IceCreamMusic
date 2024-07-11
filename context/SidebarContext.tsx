'use client';
import { createContext, PropsWithChildren, useState } from 'react';

export type TSizeSidebar = 'full' | 'small';

export const SidebarContext = createContext({
	size: 'full',
	setSize: (size: TSizeSidebar) => {},
});

export const SidebarContextProvider = ({ children }: PropsWithChildren) => {
	const [size, setSize] = useState<TSizeSidebar>('full');

	return (
		<SidebarContext.Provider value={{ size, setSize }}>
			{children}
		</SidebarContext.Provider>
	);
};
