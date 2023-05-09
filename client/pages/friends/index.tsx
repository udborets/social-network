import { DBUser } from "@/db/models";
import { DBFriends } from "@/db/models";
import CheckOutOtherUsersButton from "@/features/CheckOutOtherUsersButton/CheckOutOtherUsersButton";
import UserItem from "@/features/UserItem/UserItem";
import Post from "@/features/UserPosts/Post/Post";
import { userState } from "@/store/User";
import axios from "axios";
import { observer } from "mobx-react-lite";
import { FC } from "react";
import { useQuery } from "react-query";

const FriendsPage: FC = observer(() => {
  const { data: friends } = useQuery({
    queryFn: async () => {
      try {
        const fetchedFriends = await axios.post<{ friends: DBFriends[] }>((process.env.NEXT_PUBLIC_BACKEND_URL ?? "") + "/friends");
        if (fetchedFriends.data) {
          const friendsIds = fetchedFriends.data.friends
            .filter(({ friendId, userId }) => userId === userState.info.id)
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
    <main className="w-full h-full flex flex-col gap-5">
      {friends?.length !== 0
        ? friends?.map((userProps) => (
          <UserItem {...userProps} key={userProps.id} />
        ))
        : ''}
      <CheckOutOtherUsersButton />
    </main>
  )
})

export default FriendsPage