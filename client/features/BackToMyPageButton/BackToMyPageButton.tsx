import { observer } from "mobx-react-lite";
import Link from "next/link";
import { FC } from "react";

import { userState } from "@/store/User";

const BackToMyPageButton: FC = observer(() => {
  return (
    <div className="flex flex-col gap-5 justify-center items-center rounded-[20px]">
      <Link
        className="text-blue"
        href={`/user/${userState.info.id}`}
      >
        Back to my page!
      </Link>
    </div>
  )
})

export default BackToMyPageButton