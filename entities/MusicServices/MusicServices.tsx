import style from "./MusicServices.module.css";
import Image from "next/image";
const MusicServices = () => {
  return (
    <div className={style.MusicServices}>
      <Image
        src={"/MusicServicesIcons/dark/apple_music.svg"}
        alt="Apple Music"
        height={16}
        width={104}
      />
      <Image
        src={"/MusicServicesIcons/dark/deezer.svg"}
        alt="Deezer"
        height={16}
        width={104}
      />
      <Image
        src={"/MusicServicesIcons/dark/spotify.svg"}
        alt="Spotify"
        height={16}
        width={104}
      />
      <Image
        src={"/MusicServicesIcons/dark/tidal.svg"}
        alt="Tidal"
        height={16}
        width={104}
      />
      <Image
        src={"/MusicServicesIcons/dark/tiktok.svg"}
        alt="TikTok"
        height={16}
        width={104}
      />
      <Image
        src={"/MusicServicesIcons/dark/vk.svg"}
        alt="Vk"
        height={16}
        width={104}
      />
      <Image
        src={"/MusicServicesIcons/dark/yandex.svg"}
        alt="Yandex"
        height={16}
        width={104}
      />
      <Image
        src={"/MusicServicesIcons/dark/youtube_music.svg"}
        alt="Youtube Music"
        height={16}
        width={104}
      />
      <Image
        src={"/MusicServicesIcons/dark/zvuk.svg"}
        alt="Zvuk"
        height={16}
        width={104}
      />
    </div>
  );
};
export default MusicServices;
