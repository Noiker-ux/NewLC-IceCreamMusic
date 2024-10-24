'use client';
import style from './Sidebar.module.css';
import SidebarHeader from './SidebarHeader/SidebarHeader';
import SidebarBody from './SidebarBody/SidebarBody';
import { TiChevronRight } from 'react-icons/ti';
import { useContext } from 'react';
import classNames from 'classnames';
import { SidebarContext } from '@/context/SidebarContext';

const Sidebar = () => {
	const { size, setSize } = useContext(SidebarContext);
	const handleSize = () => {
		size === 'full' ? setSize('small') : setSize('full');
	};

	return (
		<aside
			className={classNames(style.sidebar, {
				[style.small]: size === 'small',
			})}>
			<SidebarHeader />
			<SidebarBody />
			<div
				className={classNames(style.swapSize, {
					[style.active]: size === 'small',
				})}
				onClick={handleSize}>
				<TiChevronRight />
			</div>
		</aside>
	);
};
export default Sidebar;
