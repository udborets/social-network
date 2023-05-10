import axios from "axios";
import { observer } from "mobx-react-lite";
import Image from "next/image";
import { FC } from "react";
import { useQuery } from "react-query";

import avatarImage from '@/assets/avatarImage.png';
import { DBUser } from "@/db/models";
import { userState } from "@/store/User";
import InfoForm from "./InfoForm/InfoForm";
import InfoItem from "./InfoItem/InfoItem";
import { UserInfoProps } from "./models";

const UserInfo: FC<UserInfoProps> = observer(({ userId }) => {
  const { data: userInfo, refetch } = useQuery({
    queryFn: async () => {
      try {
        const fetchedUserInfo = await axios.post<{ user: DBUser }>((process.env.NEXT_PUBLIC_BACKEND_URL ?? "") + '/users/id', { id: userId });
        if (fetchedUserInfo.data) {
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
    <div className="w-full h-fit flex flex-wrap justify-center gap-10 sm:gap-20 mt-[50px]">
      {userInfo
        ? <div className="flex flex-col gap-4">
          <Image
            src={userInfo.avatarUrl ?? avatarImage.src}
            alt="avatar image"
            width={100}
            height={100}
            className="max-h-[100px] max-w-[100px] place-self-center"
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
        ? <InfoForm refetchInfoFn={refetch} />
        : ''}
    </div>
  )
})

export default UserInfo