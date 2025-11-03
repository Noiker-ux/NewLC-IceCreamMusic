'use client';
import { TReleaseUpsert } from 'shared/schema/release.schema';
import clsx from 'clsx';
import { Reorder } from 'framer-motion';
import { useRef } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { FaUpload } from 'react-icons/fa6';
import TrackItem from './TrackItem';

export type TTRacks = {
	isUpdating?: boolean;
};

export default function Tracks({ isUpdating }: TTRacks) {
	const { control } = useFormContext<TReleaseUpsert>();

	const constraintsRef = useRef(null);

	const fileInputRef = useRef<HTMLInputElement>(null);

	const {
		append: appendTrack,
		// remove: removeTrack,
		fields: tracks,
		swap: swapTracks,
	} = useFieldArray({
		control: control,
		name: 'tracks',
	});

	const reorderTracks = (newTracks: typeof tracks) => {
		const firstDiffIndex = tracks.findIndex(
			(field, index) => field.id !== newTracks[index].id,
		);
		if (firstDiffIndex !== -1) {
			const newIndex = newTracks.findIndex(
				(field) => field.id === tracks[firstDiffIndex].id,
			);
			swapTracks(firstDiffIndex, newIndex);
		}
	};

	const handleAppendFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files?.length) {
			const newFiles: File[] = [];
			for (let i = 0; i < e.target.files?.length; i++) {
				newFiles.push(e.target.files?.item(i) as File);
			}
			fileInputRef.current!.files = new DataTransfer().files;
			newFiles.forEach((track) => {
				appendTrack({
					language: '',
					partner_code: '',
					preview_start: '00:00',
					roles: [],
					subtitle: '',
					title: '',
					track: track,
					author_rights: 0,
				});
			});
		}
	};

	const handleClick = () => {
		fileInputRef.current?.click();
	};

	return (
		<div className='col-span-4'>
			<input
				id='file-upload-handle'
				type='file'
				className='hidden'
				ref={fileInputRef}
				onChange={handleAppendFiles}
			/>
			{!isUpdating && (
				<div
					className={clsx(
						'border border-dashed border-sky-400 inset-0 z-30 bg-transparent flex flex-col gap-2 items-center justify-center h-80  mt-4 w-full  mx-auto rounded-lg',
					)}
					onClick={handleClick}>
					<FaUpload width={20} height={20} />
					<p className='font-bold  text-neutral-200 text-md '>
						Перенесите поочередно файлы сюда или нажмите, чтобы загрузить
					</p>{' '}
					<p className='text-center  text-neutral-400 text-sm '>
						Формат: .wav, .flac <br />
						Максимальный размер: 1 ГБ
					</p>
				</div>
			)}
			<Reorder.Group
				axis='y'
				values={tracks}
				onReorder={reorderTracks}
				ref={constraintsRef}>
				{tracks.map((trackData, idx) => (
					<TrackItem
						trackData={trackData}
						constraints={constraintsRef}
						key={trackData.id}
						trackIndex={idx}
					/>
				))}
			</Reorder.Group>
		</div>
	);
}
