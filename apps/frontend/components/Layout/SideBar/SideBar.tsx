import { PropsWithChildren, use } from 'react';
import Header from '../Header/Header';
import { navigation, navigationAdmin } from './SideBar.links';
import SideBarBody from './SideBarBody/SideBarBody';
import SideBarFooter from './SideBarFooter/SideBarFooter';
import SideBarHeader from './SideBarHeader/SideBarHeader';
import { actionGetPersonalData } from '@/components/Account/actionGetPersonalData';

export default function Example({ children }: PropsWithChildren) {
	const me = use(actionGetPersonalData());

	return (
		<div>
			{/* Static sidebar for desktop */}
			<div className='no-scrollbar hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col'>
				<div className='flex no-scrollbar grow flex-col gap-y-5 overflow-y-auto pt-4  px-6 pb-4'>
					<SideBarHeader />

					<nav className='flex no-scrollbar  flex-1 flex-col'>
						<ul
							role='list'
							className=' flex no-scrollbar flex-1 flex-col gap-y-7'>
							<li>
								{me.success && (
									<SideBarBody
										menu={me.data.isAdmin ? navigationAdmin : navigation}
									/>
								)}
							</li>
							<SideBarFooter />
						</ul>
					</nav>
				</div>
			</div>
			<Header />
			<div className='lg:pl-72'>
				<main className='py-10'>
					<div className='px-4 sm:px-6 lg:px-8'>{children}</div>
				</main>
			</div>
		</div>
	);
}
