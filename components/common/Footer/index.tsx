import Logo from "@/public/logo-light.svg";

import Image from "next/image";

const Footer = () => {
  return (
    <footer className="flex flex-col justify-center items-center bg-[#212a35]">
      <Image alt="logo" src={Logo} className="h-[200px]" />
    </footer>
  );
};
export default Footer;
