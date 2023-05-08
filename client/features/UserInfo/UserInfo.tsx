import { observer } from "mobx-react-lite";
import { FC } from "react";

import { UserInfoProps } from "./models";

const UserInfo: FC<UserInfoProps> = observer(({ userId }) => {
  return (
    <div className="w-full h-[500px]">
    </div>
  )
})

export default UserInfo