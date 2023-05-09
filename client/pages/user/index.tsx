import axios from "axios";
import { observer } from "mobx-react-lite";
import { FC } from "react";
import { useQuery } from "react-query";

import { DBUser } from "@/db/models";
import UserItem from "@/features/UserItem/UserItem";
import { userState } from "@/store/User";

const UserPage: FC = observer(() => {
  const { data: users } = useQuery({
    queryFn: async () => {
      try {
        const users = await axios.post<{ users: DBUser[] }>((process.env.NEXT_PUBLIC_BACKEND_URL ?? "") + '/users');
        if (users.data) {
          return users.data.users;
        }
      }
      catch (e) {
        console.error(e);
        return [] as DBUser[];
      }
    },
    queryKey: ['usersPage']
  })
  return (
    <main className="w-full h-full">
      {users
        ? users.filter(({id}) => id !== userState.info.id).map((userProps) => (
          <UserItem {...userProps} key={userProps.id} />
        ))
        : <div>There is no users yet :(</div>}
    </main>
  )
})

export default UserPage;