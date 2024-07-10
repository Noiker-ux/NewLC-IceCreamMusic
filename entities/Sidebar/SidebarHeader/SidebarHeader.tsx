import Logo from '@/shared/Logo/Logo';
import style from './SidebarHeader.module.css';

const SidebarHeader = () => {
	return (
		<div className={style.header}>
			<Logo />
			<div className={style.text}>
				<p className={style.title}>IceCreamMusic</p>
				<p className={style.description}>Все для артиста в одном месте.</p>
			</div>
		</div>
	);
};

export default SidebarHeader;
