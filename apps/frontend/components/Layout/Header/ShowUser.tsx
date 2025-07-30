import { ChevronDownIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { actionGetPersonalData } from '@/components/Account/actionGetPersonalData';
import { use } from 'react';

export default function ShowUser() {
	// const AccountData = use(actionGetPersonalData());
	return (
		<>
			<Image
				width={32}
				height={32}
				alt=''
				src='https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
				className='size-8 rounded-full bg-zinc-900'
			/>
			<span className='hidden lg:flex lg:items-center'>
				<span aria-hidden='true' className='ml-4 text-sm/6 font-semibold '>
					Tom Cook
				</span>
				<ChevronDownIcon
					aria-hidden='true'
					className='ml-2 size-5 text-gray-400'
				/>
			</span>
		</>
	);
}
