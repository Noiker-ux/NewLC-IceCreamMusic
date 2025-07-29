'use client';
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react';
import { Bars3Icon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { useState, use } from 'react';
import Notification from '../Notification/Notification';
import SideBarMobile from '../SideBar/SideBarMobile/SideBarMobile';

import ShowUser from './ShowUser';
export default function Header() {
	const userNavigation = [
		{ name: 'Мой профиль', href: '/dashboard/account/profile' },
		{ name: 'Выход', href: '#' },
	];

	const [sidebarOpen, setSidebarOpen] = useState(false);

	return (
		<>
			<SideBarMobile
				sidebarOpen={sidebarOpen}
				setSidebarOpen={setSidebarOpen}
			/>
			<div
				style={{ boxShadow: `1px 1px 30px 30px #0a0a0a` }}
				className='sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4   bg-[var(--background)] px-4 shadow-xs sm:gap-x-6 sm:px-6 lg:px-8'>
				<button
					type='button'
					onClick={() => setSidebarOpen(true)}
					className='-m-2.5 p-2.5 text-gray-700 lg:hidden'>
					<span className='sr-only'>Open sidebar</span>
					<Bars3Icon aria-hidden='true' className='size-6' />
				</button>

				{/* Separator */}
				<div aria-hidden='true' className='h-6 w-px bg-gray-900/10 lg:hidden' />

				<div className='flex items-center justify-between lg:pl-72 flex-1 gap-x-4 self-stretch lg:gap-x-6'>
					<div className='relative pl-5'>
						<div className='absolute top-0 bottom-0 my-auto inset-0 w-2 h-2 bg-green-400 rounded-md ring-1 '></div>
						<p>Сервис работает</p>
					</div>
					<div className='flex items-center gap-x-4 lg:gap-x-6'>
						<Notification />
						{/* Profile dropdown */}
						<Menu as='div' className='relative'>
							<MenuButton className='-m-1.5 flex items-center p-1.5'>
								<span className='sr-only'>Open user menu</span>
								<ShowUser />
							</MenuButton>
							<MenuItems
								transition
								className='absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-zinc-800 py-2 ring-1 shadow-lg ring-gray-900/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in'>
								{userNavigation.map((item) => (
									<MenuItem key={item.name}>
										<a
											href={item.href}
											className='block px-3 py-1 text-sm/6  data-focus:bg-gray-50 data-focus:outline-hidden'>
											{item.name}
										</a>
									</MenuItem>
								))}
							</MenuItems>
						</Menu>
					</div>
				</div>
			</div>
		</>
	);
}
