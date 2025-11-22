'use client';

import { TActionResult } from '@/components/Account/actionGetPersonalData';
import { Button } from '@heroui/button';
import { Progress } from '@heroui/progress';

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
		<div className='bg-zinc-900 p-5 rounded-xl'>
			<div>{title}</div>
			<Progress
				className='w-1/2'
				showValueLabel={true}
				aria-label='Загрузка...'
				color='success'
				value={progress * 100}
			/>
			<div>
				{result?.success == true
					? 'Загрузка прошла успешна'
					: 'Ошибка при отгрузке релиза'}
			</div>
			{result && !result.success && (
				<div>
					<Button
						color='secondary'
						type='button'
						onPress={() => retryAction?.()}>
						Повторить загрузку
					</Button>
				</div>
			)}
		</div>
	);
};
