'use client';
import { cn } from '@/utils/cn';
import {
	ArrowDownTrayIcon,
	DocumentTextIcon,
	MusicalNoteIcon,
	PlayCircleIcon,
	VideoCameraIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@heroui/button';
import { Tooltip } from '@heroui/tooltip';
import { useRef } from 'react';
import ModalTextTrack from './ModalTextTrack';
import { toast, Toaster } from 'sonner';
import Link from 'next/link';
import { Primitive } from 'sdk';
import { TTrack } from 'shared/schema/release.schema';

export default function FileList({
	track,
	downloadTrackFile,
	disabled,
}: {
	track: {
		id: string;
		track?: string;
		ringtone: string | null;
		text_sync: string | null;
		video: string | null;
		video_shot: string | null;
		text: string | null;
	};
	downloadTrackFile: boolean;
	disabled: boolean;
}) {
	const ringtoneRef = useRef<HTMLAnchorElement | null>(null);
	const syncTextRef = useRef<HTMLAnchorElement | null>(null);
	const videoRef = useRef<HTMLAnchorElement | null>(null);
	const videoShotRef = useRef<HTMLAnchorElement | null>(null);
	const trackRef = useRef<HTMLAnchorElement | null>(null);
	return (
		<>
			<Toaster />
			<Tooltip
				content={
					<div className='p-2'>
						<p>{track.ringtone ? 'Рингтон доступен' : 'Рингтон недоступен'}</p>
					</div>
				}>
				<Button
					isIconOnly
					disabled={disabled}
					variant='light'
					onPress={() => {
						if (!track.ringtone) {
							toast.error('Трек не имеет рингтона');
							return;
						}
						ringtoneRef.current?.click();
					}}
					className={cn(
						track.ringtone ? 'text-indigo-400 border border-indigo-400' : '',
					)}>
					<MusicalNoteIcon width={20} />
					{track.ringtone && (
						<Link
							download={true}
							href={`${process.env.NEXT_PUBLIC_S3_URL}/ringtones/${track.id}.${track.ringtone}`}
							className='hidden'
							ref={ringtoneRef}>
							Ringhtone
						</Link>
					)}
				</Button>
			</Tooltip>
			<ModalTextTrack text={track.text ?? null} />
			<Tooltip
				content={
					<div className='p-2'>
						<p>
							{track.text_sync
								? 'Синхронизированный текст трека доступен'
								: 'Синхронизированный текст трека отсутствует'}
						</p>
					</div>
				}>
				<Button
					isIconOnly
					disabled={disabled}
					variant='light'
					onPress={() => {
						if (!track.text_sync) {
							toast.error('Трек не имеет синхронизированного текста');
							return;
						}
						syncTextRef.current?.click();
					}}
					className={cn(
						track.text_sync ? 'text-indigo-400 border border-indigo-400' : '',
					)}>
					<DocumentTextIcon width={20} />
					<Link
						download={true}
						href={`${process.env.NEXT_PUBLIC_S3_URL}/syncs/${track.id}.${track.text_sync}`}
						className='hidden'
						ref={syncTextRef}>
						syncText
					</Link>
				</Button>
			</Tooltip>
			<Tooltip
				content={
					<div className='p-2'>
						<p>
							{track.video ? 'Видеотрек доступен' : 'Видеотрек отсутствует'}
						</p>
					</div>
				}>
				<Button
					isIconOnly
					disabled={disabled}
					variant='light'
					className={cn(
						track.video ? 'text-indigo-400 border border-indigo-400' : '',
					)}
					onPress={() => {
						if (!track.video) {
							toast.error('Трек не имеет видео');
							return;
						}
						videoRef.current?.click();
					}}>
					<PlayCircleIcon width={20} />
					<Link
						download={true}
						href={`${process.env.NEXT_PUBLIC_S3_URL}/videos/${track.id}.${track.video}`}
						className='hidden'
						ref={videoRef}>
						video
					</Link>
				</Button>
			</Tooltip>
			<Tooltip
				content={
					<div className='p-2'>
						<p>
							{track.video ? 'Видео-шот доступен' : 'Видео-шот отсутствует'}
						</p>
					</div>
				}>
				<Button
					isIconOnly
					disabled={disabled}
					variant='light'
					className={cn(
						track.video_shot ? 'text-indigo-400 border border-indigo-400' : '',
					)}
					onPress={() => {
						if (!track.video_shot) {
							toast.error('Трек не имеет Видео-шота');
							return;
						}
						videoShotRef.current?.click();
					}}>
					<VideoCameraIcon width={20} />
					<Link
						download={true}
						href={`${process.env.NEXT_PUBLIC_S3_URL}/videoshots/${track.id}.${track.video_shot}`}
						className='hidden'
						ref={videoShotRef}>
						video_shot
					</Link>
				</Button>
			</Tooltip>
			{downloadTrackFile && (
				<Tooltip
					content={
						<div className='p-2'>
							<p>{track.track ? 'Файл доступен' : 'Файл отсутствует'}</p>
						</div>
					}>
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
				</Tooltip>
			)}
		</>
	);
}
