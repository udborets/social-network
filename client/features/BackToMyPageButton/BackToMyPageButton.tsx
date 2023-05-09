import { observer } from "mobx-react-lite";
import Link from "next/link";
import { FC } from "react";

import { userState } from "@/store/User";
import { BackToMyPageButtonProps } from "./models";

const BackToMyPageButton: FC<BackToMyPageButtonProps> = observer(({ className }) => {
  return (
    <Link
      className={`text-white bg-blue hover:bg-blue-hover active:bg-blue-active transition-all duration-300 p-3 rounded-[15px] ${className}`}
      href={`/users/${userState.info.id}`}
    >
      Back to my page!
    </Link>
  )
})

export default BackToMyPageButton