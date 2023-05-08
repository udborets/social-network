import { FC } from "react"
import { NavbarProps } from "./models"
import NavLink from "./NavLink/NavLink"
import { observer } from "mobx-react-lite"
import { userState } from "@/store/User"

const Navbar: FC<NavbarProps> = observer(({ navLinks }) => {
  return (
    <nav className="w-fit">
      <ul className="flex justify-evenly w-fit gap-8">
        {userState.info.id !== ''
          ? [...navLinks, { href: `/user/${userState.info.id}`, text: "Me" }].map((navLinkProps) => (
            <NavLink
              {...navLinkProps}
              key={navLinkProps.text}
            />
          ))
          : <NavLink
            href="/auth"
            text="Auth"
          />
        }
      </ul>
    </nav>
  )
})

export default Navbar