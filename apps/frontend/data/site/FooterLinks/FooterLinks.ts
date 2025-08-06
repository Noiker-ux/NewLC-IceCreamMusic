import IFooterLinks from './FooterLinks.interface';

export const FooterData: IFooterLinks = {
	data: [
		{
			title: 'Основное',
			block: [
				{ label: 'Главная', href: '/' },
				{ label: 'Дистрибуция', href: '/distribution' },
				{ label: 'Платформы', href: '/platforms' },
				{ label: 'Вопросы', href: '/questions' },
			],
		},

		{
			title: 'Панель управления',
			block: [{ label: 'Войти', href: '/auth/signin/' }],
		},
		{
			title: 'Документы',
			block: [{ label: 'Публичная оферта', href: '/terms' }],
		},
	],
};
