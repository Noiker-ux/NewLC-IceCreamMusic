import { sessionCookieName } from '@/utils/config/auth';
import { NextRequest, NextResponse } from 'next/server';

const handler = async (req: NextRequest) => {
	const res = NextResponse.redirect(
		`${process.env.NEXT_PUBLIC_DOMAIN}/signin`,
		{ headers: req.headers },
	);

	res.cookies.delete(sessionCookieName);

	return res;
};

export { handler as GET, handler as POST };
