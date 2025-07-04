// 'use server';
// import { RequestInit } from 'next/dist/server/web/spec-extension/request';
// import { functional, IConnection } from 'sdk';

// export async function oauth() {
// 	return await functional.v1.auth.oauth.OAuthSignin(
// 		{
// 			host: 'http://localhost:5000',
// 			headers: {
// 				Authorization:
// 					'e37c05e161a752303a6b173ae6f988c5698fd86d84a4f9b2afee231b3da97e2b',
// 			},
// 			options: {
// 				next: { tags: ['qwe'] },
// 			},
// 		} as IConnection & { options: RequestInit },
// 		{ accessToken: '1234567890' },
// 	);
// }
