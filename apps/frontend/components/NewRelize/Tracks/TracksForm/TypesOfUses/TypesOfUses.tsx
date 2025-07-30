import LanguageTrack from './LanguageTrack/LanguageTrack';
import Ringhtone from './Ringhtone/Ringhtone';
import Synchronized from './Synchronized/Synchronized';
import TextTrack from './TextTrack/TextTrack';
import VideoTrack from './VideoTrack/VideoTrack';
import VideoShot from './VideoShot/VideoShot';
export default function TypesOfUses({ trackIndex }: { trackIndex: number }) {
	return (
		<div>
			<p className='font-bold text-lg'>Виды использования </p>
			<p className='max-w-xl mt-1 text-xs text-foreground-400'>
				Укажите дополнительные виды использования для трека
			</p>
			<div className='flex flex-col gap-2 mt-2'>
				<LanguageTrack trackIndex={trackIndex} />
				<TextTrack trackIndex={trackIndex} />
				<Synchronized trackIndex={trackIndex} />
				<Ringhtone trackIndex={trackIndex} />
				<VideoTrack trackIndex={trackIndex} />
				<VideoShot trackIndex={trackIndex} />
			</div>
		</div>
	);
}
