import { DetailedHTMLProps, HTMLAttributes } from 'react';

export default interface IMyInputProps
	extends DetailedHTMLProps<
		HTMLAttributes<HTMLInputElement>,
		HTMLInputElement
	> {
	label: string;
	type: 'text' | 'password' | 'email';
}
