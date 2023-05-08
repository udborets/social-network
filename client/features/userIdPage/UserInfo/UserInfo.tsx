import { observer } from "mobx-react-lite";
import { FC } from "react";

import { UserInfoProps } from "./models";
import { useQuery } from "react-query";
import axios from "axios";
import { DBUser } from "@/db/models";
import { userState } from "@/store/User";
import { useRouter } from "next/router";

const UserInfo: FC<UserInfoProps> = observer(({ userId }) => {

  const { data: userInfo } = useQuery({
    queryFn: async () => {
      try {
        const url = process.env.NEXT_PUBLIC_BACKEND_URL ?? ""
        const fetchedUser = await axios.post<{ user: DBUser, OK: boolean }>(url + `/users/id`, { id: userId });
        console.log({ id: userId })
        console.log('a', fetchedUser)
        if (fetchedUser.data.OK) {
          return fetchedUser.data.user;
        }
        return userState.info;
      }
      catch (e) {
        console.error(e);
      }
    }
  })

  return (
    <div className="w-full h-[500px]">
      {userInfo?.name}
    </div>
  )
})

export default UserInfo