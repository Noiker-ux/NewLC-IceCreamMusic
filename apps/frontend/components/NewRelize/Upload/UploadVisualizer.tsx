'use client';

import { TActionResult } from '@/components/Account/actionGetPersonalData';

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
