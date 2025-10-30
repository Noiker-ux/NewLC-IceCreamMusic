'use server';
import { sessionCookieName } from '@/shared/lib/config/auth';
import { createSDKConnection } from '@/shared/lib/config/sdk';
import { cookies } from 'next/headers';
import { functional } from 'sdk';
import {
	TReleaseInsert,
	TReleaseUpdate,
	TTrackInsertForm,
	TTrackUpdateForm,
} from 'shared/schema/release.schema';
import { TrueOmit } from 'shared/types/omit';

export async function createRelease(
	releaseData: TrueOmit<TReleaseInsert, 'preview' | 'tracks'> & {
		preview: string;
	} & {
		tracks: (TrueOmit<
			TTrackInsertForm,
			'video' | 'video_shot' | 'ringtone' | 'text_sync' | 'track'
		> & {
			video?: string;
			video_shot?: string;
			ringtone?: string;
			text_sync?: string;
			track: string;
		})[];
	},
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
		next: { tags: ['NewRelize'] },
		headers,
	});

	const { tracks, ...release } = releaseData;

	const NewRelize = await functional.api.v1.releases.createRelease(connection, {
		release: {
			...release,
			releaseDate: release.releaseDate?.toISOString(),
			startDate: release.startDate?.toISOString(),
			preorderDate: release.preorderDate?.toISOString(),
			yandexSoonNewRelease: release.yandexSoonNewRelease?.toISOString(),
		},
		tracks: tracks.map((track) => ({
			...track,
			author_rights: String(track.author_rights),
			instant_gratification: track.instant_gratification
				? new Date(track.instant_gratification).toISOString()
				: undefined,
		})),
	});

	return { success: true as const, data: NewRelize };
}

export async function updateRelease(
	releaseId: string,
	releaseData: TrueOmit<TReleaseUpdate, 'preview' | 'tracks'> & {
		preview?: string;
	} & {
		tracks: (TrueOmit<
			TTrackUpdateForm,
			'video' | 'video_shot' | 'ringtone' | 'text_sync' | 'track'
		> & {
			video?: string;
			video_shot?: string;
			ringtone?: string;
			text_sync?: string;
			track?: string;
		})[];
	},
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
		headers,
	});

	const { tracks, ...release } = releaseData;

	const UpdatedRelease = await functional.api.v1.releases.updateRelease(
		connection,
		releaseId,
		{
			release: {
				...release,
				startDate: release.startDate?.toISOString(),
				preorderDate: release.preorderDate?.toISOString(),
				yandexSoonNewRelease: release.yandexSoonNewRelease?.toISOString(),
				releaseDate: release.releaseDate?.toISOString(),
			},
			tracks: tracks.map((track) => ({
				id: track.trackId,
				data: {
					...track,
					author_rights: String(track.author_rights),
					instant_gratification: track.instant_gratification
						? new Date(track.instant_gratification).toISOString()
						: undefined,
				},
			})),
		},
	);

	return { success: true as const, data: UpdatedRelease };
}
