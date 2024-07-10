import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  return (
    <Link href={"#"}>
      <Image alt="icecreammusic" src={"/logo.png"} width={80} height={80} />
    </Link>
  );
};

export default Logo;
