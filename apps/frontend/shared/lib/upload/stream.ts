import { TActionResult } from '@/components/Account/actionGetPersonalData';
import axios from 'axios';

export type TUploadData = {
	uploadUrl: string;
	file: File;
	onStart?: () => void;
	onProgress: (progress: number) => void;
	onFinish: (data: TActionResult<string>) => void;
	meta: {
		filename: string;
	};
};

export type TUploadBlobReturn = {
	retry: () => void;
};

export function uploadBlob(uploadData: TUploadData): TUploadBlobReturn {
	const { file, uploadUrl, onProgress, onFinish, meta, onStart } = uploadData;

	const totalFileBytes = file.size;

	async function upload() {
		onStart?.();

		const uploadResult = await axios
			.put(uploadUrl, file, {
				onUploadProgress(progress: ProgressEvent) {
					onProgress(progress.loaded / totalFileBytes);
				},
			})
			.then(() => ({
				success: true as const,
				data: `Файл "${meta.filename}" успешно загружен`,
			}))
			.catch((_) => {
				return {
					success: false as const,
					error: `Не удалось загрузить файл: "${meta.filename}"`,
				};
			});

		onFinish(uploadResult);

		// let uploaded = 0;

		// onProgress(0);

		// const progressTrackingStream = new TransformStream({
		//   transform(chunk, controller) {
		//     controller.enqueue(chunk);
		//     uploaded += chunk.byteLength;
		//     onProgress(uploaded / totalFileBytes);
		//   },
		//   flush() {
		//     onProgress(uploaded / totalFileBytes);
		//   },
		// });

		// const fetchResult = await fetch(uploadUrl, {
		//   method: 'PUT',
		//   headers: {
		//     'Content-Type': 'application/octet-stream',
		//     'Content-Length': String(file.size),
		//   },
		//   body: file.stream().pipeThrough(progressTrackingStream),
		//   duplex: 'half',
		// } as RequestInit)
		// .then(() => ({
		//   success: true as const,
		//   data: `Файл "${meta.filename}" успешно загружен`,
		// }))
		// .catch((_) => {
		//   return {
		//     success: false as const,
		//     error: `Не удалось загрузить файл: "${meta.filename}"`,
		//   };
		// });

		// onProgress(1);

		// onFinish(fetchResult);
	}

	upload();

	return {
		retry() {
			upload();
		},
	};
}
