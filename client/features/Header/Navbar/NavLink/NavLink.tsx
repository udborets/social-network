import { observer } from "mobx-react-lite";
import Link from "next/link";
import { FC } from "react";

import { routeState } from "@/store/Route";
import { NavLinkProps } from "./models";

const NavLink: FC<NavLinkProps> = observer(({ href, text }) => {
  return (
    <Link
      href={href}
      className={`${href === routeState.current
        ? 'text-blue-hover'
        : ''} text-[1.2rem] active:text-blue-active hover:text-blue-hover duration-300 transition-all`}
    >
      {text}
    </Link >
  )
})

export default NavLink