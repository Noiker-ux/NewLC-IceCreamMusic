'use server';

import { sessionCookieName } from '@/shared/lib/config/auth';
import { createSDKConnection } from '@/shared/lib/config/sdk';
import { cookies } from 'next/headers';
import { functional } from 'sdk';
import {
  TStudioInsertData,
	TStudioUpdateData
} from 'shared/schema/studio.schema';

export async function createStudio(
	studioData: TStudioInsertData,
) {
	const cookieStore = await cookies();
	const token = cookieStore.get(sessionCookieName)?.value;
	if (!token) {
		return {
			success: false as const,
			error: 'Пользователь не авторизован',
		};
	}
	const headers = new Headers();
	headers.set('Authorization', token);
	const connection = createSDKConnection({
		next: { tags: ['NewStudio'] },
		headers,
	});

  const { photos, team, stats, ...studio} = studioData

  const newStudio = await functional.api.v1.studios.createStudio(connection, {
    studio,
    team,
    photos,
    stats,
  });

  return {success: true as const, data: newStudio}
}

// export async function updateStudio(studioData: TStudioUpdateData){
// 	const cookieStore = await cookies();
// 	const token = cookieStore.get(sessionCookieName)?.value;
// 	if (!token) {
// 		return {
// 			success: false as const,
// 			error: 'Пользователь не авторизован',
// 		};
// 	}
// 	const headers = new Headers();
// 	headers.set('Authorization', token);
// 	const connection = createSDKConnection({
// 		next: { tags: ['NewStudio'] },
// 		headers,
// 	});

// 	const { photos, team, stats, ...studio} = studioData;

// 	const updateData = await functional.api.v1.studios.createStudio(connection, {
//     studio,
//     team,
//     photos,
//     stats,
//   });
// }
