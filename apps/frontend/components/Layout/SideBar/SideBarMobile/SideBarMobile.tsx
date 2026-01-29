'use client';
import {
	Dialog,
	DialogBackdrop,
	DialogPanel,
	TransitionChild,
} from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import SideBarHeader from '../SideBarHeader/SideBarHeader';
import SideBarBody from '../SideBarBody/SideBarBody';
import SideBarFooter from '../SideBarFooter/SideBarFooter';
import { useState } from 'react';
import { navigation } from '../SideBar.links';

export default function SideBarMobile() {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	return (
		<>
			<button
				type='button'
				onClick={() => setSidebarOpen(true)}
				className='-m-2.5 p-2.5 text-gray-700 lg:hidden'>
				<span className='sr-only'>Open sidebar</span>
				<Bars3Icon aria-hidden='true' className='size-6' />
			</button>
			<Dialog
				open={sidebarOpen}
				onClose={setSidebarOpen}
				className='relative z-50 lg:hidden'>
				<DialogBackdrop
					transition
					className='fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-closed:opacity-0'
				/>

				<div className='fixed inset-0 flex'>
					<DialogPanel
						transition
						className='relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-closed:-translate-x-full'>
						<TransitionChild>
							<div className='absolute top-0 left-full flex w-16 justify-center pt-5 duration-300 ease-in-out data-closed:opacity-0'>
								<button
									type='button'
									onClick={() => setSidebarOpen(false)}
									className='-m-2.5 p-2.5'>
									<span className='sr-only'>Close sidebar</span>
									<XMarkIcon aria-hidden='true' className='size-6 text-white' />
								</button>
							</div>
						</TransitionChild>
						{/* Sidebar component, swap this element with another sidebar if you like */}
						<div className='flex grow flex-col gap-y-5 overflow-y-auto bg-zinc-900 pt-4 px-6 pb-4'>
							<div className='flex h-16 shrink-0 items-center'>
								<SideBarHeader />
							</div>
							<nav className='flex flex-1 flex-col'>
								<ul role='list' className='flex flex-1 flex-col gap-y-7'>
									<li>
										<SideBarBody menu={navigation} />
									</li>
									<SideBarFooter />
								</ul>
							</nav>
						</div>
					</DialogPanel>
				</div>
			</Dialog>
		</>
	);
}
