'use server';
import { TReleaseInsertForm } from '@/schema/release.schema';
import { cookies } from 'next/headers';
import { sessionCookieName } from '@/shared/lib/config/auth';
import { createSDKConnection } from '@/shared/lib/config/sdk';
import { functional } from 'sdk';

export async function action(ark: TReleaseInsertForm) {
	const mutationData = {
		...ark,
		preview: ark.preview.type.split('/').at(-1),
		roles: JSON.stringify(ark.roles),
		platforms: JSON.stringify(ark.platforms),
		area: JSON.stringify(ark.area),
		confirmed: false, //warning
		status: 'moderating', //warning
	};
	mutationData.tracks.map((track) => {
		track.roles = JSON.stringify(track.roles);
		track.track = track.track.type.split('/').at(-1);
		if (track.video) track.video = track.video.name.split('.').at(-1);
		if (track.video_shot)
			track.video_shot = track.video_shot?.name.split('.').at(-1) ?? null;
		if (track.text_sync)
			track.text_sync = track.text_sync?.name.split('.').at(-1) ?? null;
		if (track.ringtone)
			track.ringtone = track.ringtone?.name.split('.').at(-1) ?? null;
	});

	console.log(mutationData);

	const cookieStore = await cookies();
	const token = cookieStore.get(sessionCookieName)?.value;
	if (!token) {
		return {
			success: false,
			error: 'Пользователь не авторизован',
		};
	}
	const headers = new Headers();
	headers.set('Authorization', `${token}`);
	const connection = createSDKConnection({
		next: { tags: ['NewRelize'] },
		headers,
	});

	const NewRelize = await functional.v1.releases.createRelease(connection, {
		...mutationData,
	});

	return NewRelize;
}
