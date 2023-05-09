import { observer } from "mobx-react-lite";
import Link from "next/link";
import { FC } from "react";

import { HeaderProps } from "./models";
import Navbar from "./Navbar/Navbar";

const Header: FC<HeaderProps> = observer(({ navLinks }) => {
  return (
    <header className="w-full h-full px-[150px] max-h-[100px] min-h-[100px] flex justify-center items-center">
      <h2 className="w-fit h-fit text-[2rem] text-blue font-bold">
        <Link href='/'>
          MyFriends
        </Link>
      </h2>
      <span className="mx-10 w-[2px] h-[30%] bg-blue" />
      <Navbar
        navLinks={navLinks}
      />
    </header>
  )
})

export default Header