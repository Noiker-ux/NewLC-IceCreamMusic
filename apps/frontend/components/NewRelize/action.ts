'use server';
import { TReleaseInsertForm, TTrackInsertForm } from 'shared/schema/release.schema';
import { cookies } from 'next/headers';
import { sessionCookieName } from '@/shared/lib/config/auth';
import { createSDKConnection } from '@/shared/lib/config/sdk';
import { functional } from 'sdk';
import { TrueOmit } from '@/shared/lib/types';
import { TCreateReleaseBody } from 'sdk/lib/release/release.controller';

export async function action(releaseData: TrueOmit<TReleaseInsertForm, 'preview' | 'tracks'> & { preview: string } & {
	tracks: (TrueOmit<TTrackInsertForm, 'video' | 'video_shot' | 'ringtone' | 'text_sync' | 'track'> & { video?: string, video_shot?: string, ringtone?: string, text_sync?: string, track: string })[]
}) {
	const cookieStore = await cookies();
	const token = cookieStore.get(sessionCookieName)?.value;
	if (!token) {
		return {
			success: false,
			error: 'Пользователь не авторизован',
		};
	}
	const headers = new Headers();
	headers.set('Authorization', token);
	const connection = createSDKConnection({
		next: { tags: ['NewRelize'] },
		headers,
	});

	const {tracks, ...release} = releaseData;

	const NewRelize = await functional.v1.releases.createRelease(connection, {
		release:{
			...release, 
			releaseDate: new Date(release.releaseDate).toISOString(),
			startDate: new Date(release.startDate).toISOString(),
			preorderDate: new Date(release.preorderDate).toISOString(),
			yandexSoonNewRelease: release.yandexSoonNewRelease ? new Date(release.yandexSoonNewRelease).toISOString() : undefined,
		},
		tracks: tracks.map(track=>({...track, instant_gratification: track.instant_gratification ? new Date(track.instant_gratification).toISOString() : undefined}))
	});

	return NewRelize;
}
