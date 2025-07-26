import { ArrowLeftStartOnRectangleIcon } from '@heroicons/react/24/outline';

export default function SideBarFooter() {
	return (
		<li className='mt-auto'>
			<button className='group -mx-2 flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold text-indigo-200 hover:bg-indigo-700 hover:text-white'>
				<ArrowLeftStartOnRectangleIcon
					aria-hidden='true'
					className='size-6 shrink-0 text-indigo-200 group-hover:text-white'
				/>
				Выход
			</button>
		</li>
	);
}
