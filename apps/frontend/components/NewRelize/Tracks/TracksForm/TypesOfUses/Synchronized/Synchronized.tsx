import { TReleaseInsertForm } from 'shared/schema/release.schema';
import { useFormContext } from 'react-hook-form';
import { useCallback, useRef } from 'react';
import { Button } from '@heroui/button';

export default function Synchronized({ trackIndex }: { trackIndex: number }) {
	const { setValue, watch } = useFormContext<TReleaseInsertForm>();
	const handleFileChange = useCallback(
		(newFiles: File[]) => {
			setValue(`tracks.${trackIndex}.text_sync`, newFiles.at(0));
		},
		[setValue, trackIndex],
	);
	const fileRef = useRef<HTMLInputElement | null>(null);
	const textSyncWatch = watch(`tracks.${trackIndex}.text_sync`);
	return (
		<div>
			<p className='font-bold'>Синхронизированный текст трека</p>
			<p className='max-w-xl mt-1 text-sm flex text-foreground-400'>
				Получите дополнительный доход и ещё больше внимания на площадках.
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
					Загрузить файл в формате .ttml
				</Button>
				<input
					type='file'
					id={`tracks.${trackIndex}.text_sync`}
					name={`tracks.${trackIndex}.text_sync`}
					className='hidden'
					ref={fileRef}
					onChange={(e) =>
						e.target.files && handleFileChange(Array.from(e.target.files))
					}
				/>
				<p>{textSyncWatch?.name}</p>
			</div>
		</div>
	);
}
