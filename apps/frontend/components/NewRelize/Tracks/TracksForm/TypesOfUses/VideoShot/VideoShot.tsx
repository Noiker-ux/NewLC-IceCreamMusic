import { TReleaseInsertForm } from 'shared/schema/release.schema';
import { useFormContext } from 'react-hook-form';
import { useCallback, useRef } from 'react';
import { Button } from '@heroui/button';

export default function VideoShot({ trackIndex }: { trackIndex: number }) {
	const { setValue, watch } = useFormContext<TReleaseInsertForm>();
	const handleFileChange = useCallback(
		(newFiles: File[]) => {
			setValue(`tracks.${trackIndex}.video_shot`, newFiles.at(0));
		},
		[setValue, trackIndex],
	);
	const fileRef = useRef<HTMLInputElement | null>(null);
	const VideoShotWatch = watch(`tracks.${trackIndex}.video_shot`);
	return (
		<div>
			<p className='font-bold'>Загрузка видео-шота</p>
			<p className='max-w-xl mt-1 text-sm flex text-foreground-400'>
				Формат: .mov, .mp4, .avi
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
					id={`tracks.${trackIndex}.video_shot`}
					name={`tracks.${trackIndex}.video_shot`}
					className='hidden'
					ref={fileRef}
					onChange={(e) =>
						e.target.files && handleFileChange(Array.from(e.target.files))
					}
				/>
				<p>{VideoShotWatch?.name}</p>
			</div>
		</div>
	);
}
