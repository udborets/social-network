import { observer } from "mobx-react-lite";
import { FC } from "react";

import { UserInfoProps } from "./models";
const UserInfo: FC<UserInfoProps> = observer(({ userId }) => {
  
  
  // useEffect(() => {
  //   refetch()
  // }, [])
  return (
    <div className="w-full h-[500px]">
      {/* {userInfo?.name} */}
    </div>
  )
})

export default UserInfo