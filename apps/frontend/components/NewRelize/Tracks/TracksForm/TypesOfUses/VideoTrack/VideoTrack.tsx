import { TReleaseUpsert } from 'shared/schema/release.schema';
import { useFormContext } from 'react-hook-form';
import { useCallback, useRef } from 'react';
import { Button } from '@heroui/button';

export default function VideoTrack({ trackIndex }: { trackIndex: number }) {
	const { setValue, watch } = useFormContext<TReleaseUpsert>();
	const handleFileChange = useCallback(
		(newFiles: File[]) => {
			setValue(`tracks.${trackIndex}.video`, newFiles.at(0));
		},
		[setValue, trackIndex],
	);
	const fileRef = useRef<HTMLInputElement | null>(null);
	const VideoWatch = watch(`tracks.${trackIndex}.video`);
	return (
		<div>
			<p className='font-bold'>Загрузка видео</p>
			<p className='max-w-xl mt-1 text-sm flex text-foreground-400'>
				Формат: .mov, .mp4, .avi
				<br /> Максимальный размер: не более 6 ГБ
			</p>
			<div className='mt-4 flex gap-4 items-center'>
				<Button
					size='md'
					radius='sm'
					className={'bg-indigo-700'}
					onPress={() => {
						if (fileRef.current) {
							fileRef!.current.click();
						}
					}}>
					Загрузить файл в форматах .mov, .mp4, .avi
				</Button>
				<input
					type='file'
					id={`tracks.${trackIndex}.video`}
					name={`tracks.${trackIndex}.video`}
					className='hidden'
					ref={fileRef}
					onChange={(e) =>
						e.target.files && handleFileChange(Array.from(e.target.files))
					}
				/>
				<p>{VideoWatch?.name}</p>
			</div>
		</div>
	);
}
