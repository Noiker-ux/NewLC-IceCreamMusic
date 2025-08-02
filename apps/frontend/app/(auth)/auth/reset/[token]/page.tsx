import { ResetPasswordForm } from '@/components/AuthttorizeAndRegistration/ResetPassword/ResetPassword';
import { createSDKConnection } from '@/shared/lib/config/sdk';
import { functional } from 'sdk';

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
				className={'flex justify-center items-center flex-col mx-auto w-[90%]'}>
				<ResetPasswordForm token={token} />
			</div>
		</div>
	);
}
