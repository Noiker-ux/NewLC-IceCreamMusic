export default interface IService {
	icon: string;
	altIcon: string;
	countBuy: number;
	title: string;
	description: string;
	price: number;
	timeframe: string;
	listBenefit: string[];
	color?: 'green' | 'orange' | 'purple';
	href: string;
	labelButton: string;
}
