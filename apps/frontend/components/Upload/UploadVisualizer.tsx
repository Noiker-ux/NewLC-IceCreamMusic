'use client';

import { TActionResult } from '@/components/Account/actionGetPersonalData';

export type TUploadBase = {
	file: File;
	url: string;
};

export type TUploadFile =
	| (TUploadBase & { belongsTo: 'release'; type: 'preview' })
	| (TUploadBase & {
			belongsTo: 'track';
			trackIndex: number;
			type: 'track' | 'text_sync' | 'video' | 'video_shot' | 'ringtone';
	  })
	| (TUploadBase & { belongsTo: 'studio'; type: 'background' | 'logo' })
	| (TUploadBase & { belongsTo: 'studio_team'; type: 'photo' })
	| (TUploadBase & { belongsTo: 'studio_photo'; type: 'url' });

export type TUploadResult = TUploadFile & {
	progress: number;
	result?: TActionResult<string>;
	retry?: () => void;
	title: string;
};

export type TFileUploader = {
	file: File;
	title: string;
	progress: number;
	retryAction?: () => void;
	result?: TActionResult<string>;
};

export const UploadVisualizer = ({
	file,
	title,
	progress,
	retryAction,
	result,
}: TFileUploader) => {
	return (
		<div>
			<div>{title}</div>
			<div>Size: {file.size}</div>
			<div>Progress: {progress}</div>
			<div>Result: {JSON.stringify(result)}</div>
			{result && !result.success && (
				<div>
					<button type='button' onClick={() => retryAction?.()}>
						повторить загрузку
					</button>
				</div>
			)}
		</div>
	);
};
