'use client'

import axios from "axios";
import { observer } from "mobx-react-lite";
import Link from "next/link";
import { useRouter } from "next/router"
import { useQuery } from "react-query";
import { DBUser } from "@/db/models";
import { userState } from "@/store/User";
import PostField from "@/features/PostField/PostField";
import BackToMyPageButton from "@/features/BackToMyPageButton/BackToMyPageButton";

const UserIdPage = observer(() => {
  const router = useRouter();
  const { data: userInfo } = useQuery({
    queryFn: async () => {
      const id = router.query.id as string;
      try {
        const url = process.env.NEXT_PUBLIC_BACKEND_URL ?? ""
        const fetchedUser = await axios.post<{ user: DBUser, OK: boolean }>(url + `/users/id`, { id })
        if (fetchedUser.data.OK) {
          return fetchedUser.data.user;
        }
      }
      catch (e) {
        console.error(e);
      }
    },
    queryKey: [`${router.query.id}`]
  })
  if (!userInfo?.id) {
    return (
      <main className="w-full h-full grid place-items-center font-bold text-[1.5rem]">
        <BackToMyPageButton />
      </main>
    )
  }
  return (
    <main className="w-full h-full flex flex-col">
      {userInfo.name}
      {userInfo.id === userState.info.id
        ? <PostField />
        : ''}
    </main>
  )
})

export default UserIdPage;