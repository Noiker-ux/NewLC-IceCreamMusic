export default interface IFooterLinks {
	data: FooterSection[];
}

export interface FooterSection {
	title: string;
	block: FooterLink[];
}

export interface FooterLink {
	label: string;
	href: string;
}
