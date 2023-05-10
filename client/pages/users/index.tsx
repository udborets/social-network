import axios from "axios";
import { observer } from "mobx-react-lite";
import Head from "next/head";
import { FC, useState } from "react";
import { useQuery } from "react-query";

import { DBUser } from "@/db/models";
import UserItem from "@/features/UserItem/UserItem";
import { userState } from "@/store/User";

const UserPage: FC = observer(() => {
  const [searchQuery, setSearchQuery] = useState<string>('');
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
    <>
      <Head>
        <title>MyFriends | Users</title>
      </Head>
      <main className="w-full h-fit flex flex-col justify-start items-center gap-10 sm:p-[100px] flex-grow">
        <div className="flex flex-col justify-center items-center gap-4">
          <span className="font-bold text-[3rem] text-center">
            All users
          </span>
          <input
            className="max-w-[300px] w-full rounded-[10px] p-2 outline-[var(--blue)] outline"
            placeholder="Enter user name..."
            onChange={(e) => setSearchQuery(e.target.value.trim())}
            type="text"
          />
        </div>
        {(users && users.filter(({ id }) => id !== userState.info.id).length !== 0)
          ? users.filter(({ id, name }) => (id !== userState.info.id && name.includes(searchQuery))).map((userProps) => (
            <UserItem {...userProps} key={userProps.id} />
          ))
          : <div className="font-bold text-[1.5rem]">
            There is no users yet :(
          </div>}
      </main>
    </>
  )
})

export default UserPage;