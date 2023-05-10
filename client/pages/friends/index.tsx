import axios from "axios";
import { observer } from "mobx-react-lite";
import Head from "next/head";
import { FC } from "react";
import { useQuery } from "react-query";

import { DBFriends, DBUser } from "@/db/models";
import CheckOutOtherUsersButton from "@/features/CheckOutOtherUsersButton/CheckOutOtherUsersButton";
import UserItem from "@/features/UserItem/UserItem";
import { userState } from "@/store/User";

const FriendsPage: FC = observer(() => {
  const { data: friends } = useQuery({
    queryFn: async () => {
      try {
        const fetchedFriends = await axios.post<{ friends: DBFriends[] }>((process.env.NEXT_PUBLIC_BACKEND_URL ?? "") + "/friends");
        if (fetchedFriends.data) {
          const friendsIds = fetchedFriends.data.friends
            .filter(({ userId }) => userId === userState.info.id)
            .map(({ friendId }) => friendId)
          const allUsers = await axios.post<{ users: DBUser[] }>((process.env.NEXT_PUBLIC_BACKEND_URL ?? "") + "/users")
          if (allUsers.data) {
            return allUsers.data.users.filter(({ id }) => friendsIds.includes(id));
          }
        }
        return [] as DBUser[];
      }
      catch (e) {
        console.error(e);
        return [] as DBUser[];
      }
    },
    queryKey: [`friendsPage${userState.info.id}`],
  })
  return (
    <>
      <Head>
        <title>MyFriends | Friends</title>
      </Head>
      <main className="w-full h-fit flex-grow flex flex-col sm:p-[100px] gap-10 justify-start items-center">
        <span className="font-bold text-[3rem] text-center">
          Your friends
        </span>
        {friends?.length !== 0
          ? friends?.map((userProps) => (
            <UserItem {...userProps} key={userProps.id} />
          ))
          : ''}
        <CheckOutOtherUsersButton />
      </main>
    </>
  )
})

export default FriendsPage