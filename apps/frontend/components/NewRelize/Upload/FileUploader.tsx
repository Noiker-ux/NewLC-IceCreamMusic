'use client';

import { TActionResult } from '@/components/Account/actionGetPersonalData';
import { useEffect, useState } from 'react';

export type TFileUploader = {
	file: File;
	uploadUrl: string;
	title: string;
	setUploadResult: (promise: TActionResult<string>) => void;
};

export const FileUploader = ({
	file,
	title,
	uploadUrl,
	setUploadResult,
}: TFileUploader) => {
	const [progress, setProgress] = useState(0);
	const [bytesUploaded, setBytesUploaded] = useState(0);
	const [error, setError] = useState<boolean>(false);

	const uploadBlob = async () => {
		const totalFileBytes = file.size;

		let uploaded = bytesUploaded;

		const progressTrackingStream = new TransformStream({
			transform(chunk, controller) {
				controller.enqueue(chunk);
				uploaded += chunk.byteLength;
				setBytesUploaded(uploaded);
				setProgress(uploaded / totalFileBytes);
			},
			flush() {
				setProgress(uploaded / totalFileBytes);
			},
		});

		const fetchResult = await fetch(uploadUrl, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/octet-stream',
				'Content-Length': String(file.size),
			},
			body: file.stream().pipeThrough(progressTrackingStream),
			duplex: 'half',
		} as RequestInit)
			.then(() => ({
				success: true as const,
				data: `Файл "${title}" успешно загружен`,
			}))
			.catch((e) => {
				setError(true);
				return {
					success: false as const,
					error: `Не удалось загрузить файл: "${title}" из-за ошибки ${e.message}`,
				};
			});

		setUploadResult(fetchResult);
	};

	useEffect(() => {
		uploadBlob();
	}, []);

	return (
		<div>
			<div>{title}</div>
			<div>
				Uploaded: {bytesUploaded} / {file.size}
			</div>
			<div>Progress: {progress}</div>
			<div>
				{error && (
					<button type='button' onClick={() => uploadBlob()}>
						повторить загрузку
					</button>
				)}
			</div>
		</div>
	);
};
