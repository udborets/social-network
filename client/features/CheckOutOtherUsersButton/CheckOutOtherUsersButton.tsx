import Link from "next/link";
import { FC } from "react";

const CheckOutOtherUsersButton: FC = () => {
  return (
    <Link
      className="px-10 py-5 hover:bg-slate-200 duration-300 transition-all active:bg-slate-500 outline-[var(--blue)] outline rounded-[20px]"
      href='/users'
    >
      Look out for users!
    </Link>
  )
}

export default CheckOutOtherUsersButton;