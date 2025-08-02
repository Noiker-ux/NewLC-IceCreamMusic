'use server';
import { TSignUpClientSchema } from '@/schema/signup.schema';
import { createSDKConnection } from '@/shared/lib/config/sdk';
import { createSMTPClient } from '@/utils/createSMTPClient';
import { functional } from 'sdk';
import { render } from '@react-email/render';
import SignUpConfirm from '@/emails/SignUpConfirm';
import { redirect } from 'next/navigation';

const connection = createSDKConnection({});

export async function actionRegister(data: TSignUpClientSchema) {
	
	const signUpResult = await functional.v1.auth.signup
		.credentialsSignUp(connection, {
			name: data.name,
			email: data.email,
			password: data.password,
		})
		.then((data) => {
			return {
				success: true as const,
				data,
			};
		})
		.catch((e) => {
			return {
				success: false as const,
				error: e.message,
			};
		});

	if (!signUpResult.success) {
		return signUpResult;
	}

	const transport = await createSMTPClient().catch(() => null);
	if (!transport) {
		return {
			success: false as const,
			error: 'Ошибка отправки письма',
		};
	}

	const magicLink = `${process.env.NEXT_PUBLIC_DOMAIN}/api/auth/verify/${encodeURI(
		signUpResult.data.verificationToken,
	)}`;

	const emailHTML = await render(SignUpConfirm({ link: magicLink }));

	transport.sendMail({
		from: 'info@icecreammusic.net',
		to: data.email,
		html: emailHTML,
		subject: 'Подтверждениее регистрации аккаунта',
	});

	redirect('/auth/signup/complete');
}
