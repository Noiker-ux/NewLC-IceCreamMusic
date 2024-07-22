import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  return (
    <Link href={"#"}>
      <Image alt="icecreammusic" src={"/logo.png"} width={60} height={60} />
    </Link>
  );
};

export default Logo;
