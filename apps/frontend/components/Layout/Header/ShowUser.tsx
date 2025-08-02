import { ChevronDownIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { actionGetPersonalData } from '@/components/Account/actionGetPersonalData';
import { use } from 'react';

export default function ShowUser() {
	const AccountData = use(actionGetPersonalData());
	const avatarUrl = avatar?.includes('https://')
		? avatar
		: `${process.env.NEXT_PUBLIC_S3_URL}/avatars/${id}.${avatar}`;
	return (
		<>
			<Image
				width={32}
				height={32}
				alt=''
				src={
					AccountData.success && AccountData.data.avatar?.includes('https://')
						? AccountData.data.avatar
						: `${process.env.NEXT_PUBLIC_S3_URL}/avatars/${AccountData.data.id}.${AccountData.data.avatar}`
				}
				className='size-8 rounded-full bg-zinc-900'
			/>
			<span className='hidden lg:flex lg:items-center'>
				<span aria-hidden='true' className='ml-4 text-sm/6 font-semibold '>
					{AccountData.success && AccountData.data?.name}
				</span>
				<ChevronDownIcon
					aria-hidden='true'
					className='ml-2 size-5 text-gray-400'
				/>
			</span>
		</>
	);
}
