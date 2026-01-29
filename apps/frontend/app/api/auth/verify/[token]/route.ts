import { createSDKConnection } from '@/shared/lib/config/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { functional } from 'sdk';

const connection = createSDKConnection({});

export const GET = async (
	request: NextRequest,
	{ params }: { params: Promise<{ token: string }> },
) => {
	const { token } = await params;

	const result = await functional.api.v1.auth.verification
		.confirmEmail(connection, token)
		.catch((e) => `${e.message}`);

	if (typeof result === 'string') {
		return NextResponse.json(
			{
				message: 'Неверный токен',
			},
			{ status: 400, headers: request.headers },
		);
	}

	const redirectUrl = new URL('/auth/signin', process.env.NEXT_PUBLIC_DOMAIN!);

	return NextResponse.redirect(redirectUrl, { headers: request.headers });
};
