export type TMenu = {
	name: string;
	href?: string;
	icon: string;
	subMenu?: TMenu[];
	comming?: boolean;
};

export const navigation: TMenu[] = [
	{
		name: 'Новости',
		href: '/dashboard/main/news/',
		icon: 'heroicons:newspaper',
	},
	{
		name: 'Ваша музыка',
		icon: 'heroicons:musical-note',
		subMenu: [
			{
				name: 'Мои релизы',
				href: '/dashboard/relizes/my-relizes',
				icon: 'heroicons:wallet',
			},
			{
				name: 'Новый релиз',
				href: '/dashboard/relizes/new-relize',
				icon: 'heroicons:folder',
			},
		],
	},
	{
		name: 'Маркетинг',
		icon: 'heroicons:sparkles',
		subMenu: [
			{
				name: 'Промо ссылки',
				href: '/dashboard/marketing/promo-links/',
				icon: 'heroicons:link',
			},
			{
				name: 'Приоритетный релиз',
				href: '/dashboard/marketing/priority-release/',
				icon: 'heroicons:arrow-right-start-on-rectangle',
			},
			{
				name: 'Масспостинг',
				href: '/dashboard/marketing/massposting',
				icon: 'heroicons:chart-bar-square',
			},
			{
				name: 'Продвижение',
				href: '/dashboard/marketing/promotion',
				icon: 'heroicons:arrow-trending-up',
			},
		],
	},
	{ name: 'Студии', href: '/dashboard/studios/', icon: 'heroicons:map' },
	{
		name: 'Аналитика',
		href: '/dashboard#',
		icon: 'heroicons:chart-pie',
		comming: true,
	},
	{
		name: 'FAQ',
		href: '/dashboard/main/faq/',
		icon: 'heroicons:question-mark-circle',
	},
	{
		name: 'Маркет битов',
		href: '/dashboard#',
		icon: 'heroicons:building-storefront',
		comming: true,
	},
	{
		name: 'Аккаунт',
		icon: 'heroicons:shield-exclamation',
		subMenu: [
			{
				name: 'Профиль',
				href: '/dashboard/account/profile/',
				icon: 'heroicons:user',
			},
			{
				name: 'Верификация',
				href: '/dashboard/account/verification',
				icon: 'heroicons:check-circle',
			},
		],
	},

	{
		name: 'Поддержка',
		href: '/dashboard#',
		icon: 'heroicons:chat-bubble-left-right',
	},
	{
		name: 'Тарифы',
		href: '/dashboard/plans/',
		icon: 'heroicons:star',
	},
];
