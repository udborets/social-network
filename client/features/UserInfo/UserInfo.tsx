import axios from "axios";
import { observer } from "mobx-react-lite";
import Image from "next/image";
import { FC } from "react";
import { useQuery } from "react-query";

import avatarImage from '@/assets/avatarImage.png';
import { DBUser } from "@/db/models";
import InfoItem from "./InfoItem/InfoItem";
import { UserInfoProps } from "./models";
import { userState } from "@/store/User";
import InfoForm from "./InfoForm/InfoForm";

const UserInfo: FC<UserInfoProps> = observer(({ userId }) => {
  const { data: userInfo } = useQuery({
    queryFn: async () => {
      try {
        const fetchedUserInfo = await axios.post<{ user: DBUser }>((process.env.NEXT_PUBLIC_BACKEND_URL ?? "") + '/users/id', { id: userId });
        if (fetchedUserInfo.data) {
          console.log(fetchedUserInfo.data.user)
          return fetchedUserInfo.data.user;
        }
      }
      catch (e) {
        console.error(e);
      }
    },
    refetchInterval: 5000,
    queryKey: [`userInfo${userId}`],
  })
  return (
    <div className="w-full h-fit flex flex-wrap justify-around gap-10">
      {userInfo
        ? <div className="flex flex-col gap-4">
          <Image
            src={userInfo.avatarUrl ?? avatarImage.src}
            alt="avatar image"
            width={100}
            height={100}
            className="max-h-[100px] max-w-[100px]"
          />
          <InfoItem
            info={userInfo.name}
            text="Username"
          />
          <InfoItem
            info={userInfo.age}
            text="Age"
          />
          <InfoItem
            info={userInfo.city}
            text="City"
          />
          <InfoItem
            info={userInfo.univ}
            text="Currently studying in"
          />
        </div>
        : ''}
      {userState.info.id === userInfo?.id
        ? <InfoForm />
        : ''}
    </div>
  )
})

export default UserInfo