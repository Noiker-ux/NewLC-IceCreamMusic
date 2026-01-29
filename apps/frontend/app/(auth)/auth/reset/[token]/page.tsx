import { ResetPasswordForm } from '@/components/AuthttorizeAndRegistration/ResetPassword/ResetPassword';
import { db } from 'db';
import { unsealData } from 'iron-session';
import { redirect } from 'next/navigation';

const wrongUrl = '/reset/wrong';

export default async function ResetPasswordPage({
	params: { token },
}: {
	params: { token: string };
}) {
	const tokenData = await unsealData<Record<'token', string>>(token, {
		password: process.env.MAGIC_LINK_SECRET!,
		ttl: 60 * 10,
	}).catch(() => null);

	if (!tokenData) {
		redirect(wrongUrl);
	}

	const user = await db.query.users.findFirst({
		where: (us, { eq }) => eq(us.resetPasswordToken, tokenData.token),
	});

	if (!user) {
		redirect(wrongUrl);
	}

	return (
		<div
			className={
				'text-white m-auto border-y-1 border-[#424242] w-full px-24 text-center relative'
			}>
			<div
				className={'flex justify-center items-center flex-col mx-auto w-[90%]'}>
				<ResetPasswordForm token={tokenData.token} />
			</div>
		</div>
	);
}
