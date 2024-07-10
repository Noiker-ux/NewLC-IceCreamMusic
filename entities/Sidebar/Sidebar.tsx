import Logo from '@/shared/Logo/Logo';
import style from './Sidebar.module.css';
import SidebarHeader from './SidebarHeader/SidebarHeader';

const Sidebar = () => {
	return (
		<aside className={style.sidebar}>
			<SidebarHeader />
		</aside>
	);
};
export default Sidebar;
