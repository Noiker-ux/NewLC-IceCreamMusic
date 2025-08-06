import { CiPlay1, CiPause1 } from 'react-icons/ci';

import { Button } from '@heroui/button';

import { Tooltip } from '@heroui/tooltip';

import {
	MusicalNoteIcon,
	PlayCircleIcon,
	DocumentTextIcon,
	ArrowDownTrayIcon,
	VideoCameraIcon,
} from '@heroicons/react/24/outline';
import { TTrack } from 'shared/schema/release.schema';
import { Primitive } from 'sdk';
import React, { useRef } from 'react';
import { cn } from '@/utils/cn';
import { toast } from 'sonner';
import Link from 'next/link';
import ModalTextTrack from './ModalTextTrack';
import FileList from './FileList';

export default function MusicList({ tracks }: { tracks: Primitive<TTrack>[] }) {
	const ringtoneRef = useRef<HTMLAnchorElement | null>(null);
	const syncTextRef = useRef<HTMLAnchorElement | null>(null);
	const videoRef = useRef<HTMLAnchorElement | null>(null);
	const videoShotRef = useRef<HTMLAnchorElement | null>(null);
	const trackRef = useRef<HTMLAnchorElement | null>(null);
	const trackRefAudio = useRef<HTMLAudioElement | null>(null);

	const [play, setPlay] = React.useState(false);
	const handlePlayAudio = () => {
		if (trackRefAudio.current) {
			if (!play) {
				trackRefAudio.current.play();
				setPlay(true);
			} else {
				trackRefAudio.current.pause();
				setPlay(false);
			}
		} else {
			toast.error('Не удалось воспроизвести трек');
		}
	};

	return (
		<div className='mt-3'>
			<div
				className='grid grid-cols-[50px,50px,1fr,1fr,1fr,1fr,1fr,200px] border-t-1  items-center
			 border-zinc-800 justify-between py-2 gap-y-2 px-5'>
				<p className='border-zinc-800 pb-2 border-b-1'>№</p>
				<p className='border-zinc-800 pb-2 border-b-1'> </p>
				<p className='border-zinc-800 pb-2 text-center border-b-1'>Название</p>
				<p className='border-zinc-800 pb-2 text-center border-b-1'>
					Подзаголовок
				</p>
				<p className='border-zinc-800 pb-2 text-center border-b-1'>
					Длительность
				</p>
				<p className='border-zinc-800 pb-2 text-center border-b-1'>Доля прав</p>
				<p className='border-zinc-800 pb-2 text-center border-b-1'>Сервисы</p>
				<p className='border-zinc-800 pb-2 text-end border-b-1'>Файл</p>

				{tracks.map((track) => (
					<React.Fragment key={track.id}>
						<p>{track.index + 1}</p>
						<Button
							isIconOnly
							variant='light'
							onPress={() => {
								handlePlayAudio();
							}}>
							{play ? <CiPause1 /> : <CiPlay1 />}
							<figure className='hidden'>
								<audio
									ref={trackRefAudio}
									controls
									src={`${process.env.NEXT_PUBLIC_S3_URL}/tracks/${track.id}.${track.track}`}></audio>
							</figure>
						</Button>
						<p className='text-center'>{track.title}</p>
						<p className='text-center'>{track.subtitle}</p>
						<p className='text-center'>
							{(Number(trackRefAudio.current?.duration) / 60).toFixed(2)}
						</p>
						<p className='text-center'>{track.author_rights}%</p>
						<div className='flex justify-center items-center gap-2'>
							<FileList track={track} downloadTrackFile={false} />
						</div>
						<div className='flex justify-end items-center'>
							<Button
								isIconOnly
								className='bg-indigo-700'
								onPress={() => {
									if (!track.track) {
										toast.error('Не удалось скачать трек');
										return;
									}
									trackRef.current?.click();
								}}>
								<ArrowDownTrayIcon width={20} />
								<Link
									download={true}
									href={`${process.env.NEXT_PUBLIC_S3_URL}/tracks/${track.id}.${track.track}`}
									className='hidden'
									ref={trackRef}>
									track
								</Link>
							</Button>
						</div>
					</React.Fragment>
				))}
			</div>
		</div>
	);
}
