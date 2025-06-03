import Marquee from '../Markqee';
import Image from 'next/image';

export default function MarkqeeServices() {
	return (
		<Marquee className='rounded-xl'>
			<Image
				src={'/assets/MusicServices/apple_music.svg'}
				alt={''}
				width={200}
				height={150}
			/>
			<Image
				src={'/assets/MusicServices/deezer.svg'}
				alt={''}
				width={200}
				height={150}
			/>
			<Image
				src={'/assets/MusicServices/spotify.svg'}
				alt={''}
				width={200}
				height={150}
			/>
			<Image
				src={'/assets/MusicServices/tidal.svg'}
				alt={''}
				width={200}
				height={150}
			/>
			<Image
				src={'/assets/MusicServices/tiktok.svg'}
				alt={''}
				width={200}
				height={150}
			/>
			<Image
				src={'/assets/MusicServices/vk.svg'}
				alt={''}
				width={200}
				height={150}
			/>
			<Image
				src={'/assets/MusicServices/yandex.svg'}
				alt={''}
				width={200}
				height={150}
			/>
			<Image
				src={'/assets/MusicServices/youtube_music.svg'}
				alt={''}
				width={200}
				height={150}
			/>
			<Image
				src={'/assets/MusicServices/zvuk.svg'}
				alt={''}
				width={200}
				height={150}
			/>
		</Marquee>
	);
}
