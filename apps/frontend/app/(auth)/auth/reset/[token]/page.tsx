import { ResetPasswordForm } from '@/components/AuthttorizeAndRegistration/ResetPassword/ResetPassword';
import { createSDKConnection } from '@/shared/lib/config/sdk';
import { Metadata } from 'next';
import { functional } from 'sdk';

export const metadata: Metadata = {
	title: 'ICECREAMMUSIC | Восстановление пароля',
	description:
		'ICECREAMMUSIC - Управляйте своим творчеством, продажами и маркетингом в одном месте, чтобы сделать вашу музыку заметной и доступной миллионам слушателей!',
};

const connection = createSDKConnection({});
export default async function ResetPasswordPage({
	params,
}: {
	params: Promise<{ token: string }>;
}) {
	const { token } = await params;

	const validationResult = await functional.v1.auth.token
		.verifyEmailToken(connection, token, 'recover')
		.catch((e) => `${e.message}`);

	if (typeof validationResult === 'string') {
		return <p>wrong token {validationResult}</p>;
	}

	return (
		<div
			className={
				'text-white m-auto border-y-1 border-[#424242] w-full px-24 text-center relative'
			}>
			<div
				className={
					'flex justify-center items-center flex-col mx-auto w-[90%] py-5'
				}>
				<ResetPasswordForm token={token} />
			</div>
		</div>
	);
}
