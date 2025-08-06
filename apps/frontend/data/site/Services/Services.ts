import IService from './Service.interface';

export const Services: IService[] = [
	{
		title: 'Премиум артист',
		description:
			'Данная подписка действует, при наличии от 10к прослушиваний в месяц. Подписка также распространяется на лэйблы.',
		icon: '/assets/site_assets/service/microphone.png',
		altIcon: 'Иконка микрофона',
		countBuy: 153,
		color: 'green',
		price: 0,
		timeframe: 'навсегда',
		href: '/auth/signin/',
		listBenefit: [
			'Личный кабинет',
			'Премиальная промо-поддержка',
			'Бесплатная дистрибуция',
			'Создание смарт-ссылок',
		],
		labelButton: 'Попробовать',
	},
	{
		title: 'Профессиональная',
		description:
			'Погрузитесь в мир уникальных возможностей и эксклюзивных преимуществ. Подходит для тех, кто стремится к максимальному успеху.',
		icon: '/assets/site_assets/service/moneyBack.png',
		altIcon: 'Иконка портфеля',
		countBuy: 230,
		href: '/auth/signin/',
		labelButton: 'Купить',
		price: 2299,
		color: 'orange',
		timeframe: 'навсегда',
		listBenefit: [
			'Премиальная промо-поддержка',
			'Добавление караоке-текстов',
			'Приоритетная поддержка с личным менеджером',
			'Премиальные функции',
		],
	},
	{
		title: 'Премиум',
		description:
			'Получите полный доступ ко всем функциям платформы. Подходит для тех, кто стремится к серьезному росту.',
		icon: '/assets/site_assets/service/dollar.png',
		altIcon: 'Иконка доллара',
		countBuy: 417,
		href: '/auth/signin/',
		labelButton: 'Купить',
		price: 3399,
		color: 'purple',
		timeframe: 'навсегда',
		listBenefit: [
			'90% от дохода',
			'Премиальная отгрузка',
			'Приоритетная поддержка с личным менеджером',
		],
	},
];
