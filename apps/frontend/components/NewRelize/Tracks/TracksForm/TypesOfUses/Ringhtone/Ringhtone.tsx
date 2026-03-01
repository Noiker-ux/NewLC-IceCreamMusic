import { TReleaseUpsert } from 'shared/schema/release.schema';
import { useFormContext } from 'react-hook-form';
import { useCallback, useRef } from 'react';
import { Button } from '@heroui/button';

export default function Ringhtone({ trackIndex }: { trackIndex: number }) {
	const { setValue, watch } = useFormContext<TReleaseUpsert>();
	const handleFileChange = useCallback(
		(newFiles: File[]) => {
			setValue(`tracks.${trackIndex}.ringtone`, newFiles.at(0));
		},
		[setValue, trackIndex],
	);
	const fileRef = useRef<HTMLInputElement | null>(null);
	const RingtoneWatch = watch(`tracks.${trackIndex}.ringtone`);
	return (
		<div>
			<p className='font-bold'>Добавление рингтона</p>
			<p className='max-w-xl mt-1 text-sm flex text-foreground-400'>
				Формат: .wav, .flac
				<br />
				Длина: от 5 до 29.99 сек.
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
					Загрузить файл в формате .wav или .flac
				</Button>
				<input
					type='file'
					id={`tracks.${trackIndex}.ringtone`}
					name={`tracks.${trackIndex}.ringtone`}
					className='hidden'
					ref={fileRef}
					onChange={(e) =>
						e.target.files && handleFileChange(Array.from(e.target.files))
					}
				/>
				<p>{RingtoneWatch?.name}</p>
			</div>
		</div>
	);
}
