import { observer } from "mobx-react-lite";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC } from "react";

import { userState } from "@/store/User";
import { NavLinkProps } from "./models";

const NavLink: FC<NavLinkProps> = observer(({ href, text }) => {
  const router = useRouter();
  return (
    <Link
      href={href}
      className={`${href === "/" + router.route.split('/')[1] ||
        (router.asPath === `/user/${userState.info.id}` && text === 'Me')
        ? 'text-blue-hover hover:text-blue-hover'
        : ''} text-[1.2rem] active:text-blue-active hover:text-blue-hover duration-300 transition-all`}
    >
      {text}
    </Link>
  )
})

export default NavLink