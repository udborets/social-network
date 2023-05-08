'use client'

import UserInfo from "@/features/userIdPage/UserInfo/UserInfo";
import { userState } from "@/store/User";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router"
import { useEffect, useState } from "react";

const UserIdPage = observer(() => {
  const router = useRouter();
  const [userId, setUserId] = useState<string>('');
  useEffect(() => {
    const id = router.query.id as string;
    setUserId(id);
    console.log(id)
  }, [router.isReady])
  return (
    <main>
      <UserInfo userId={userId} />
    </main>
  )
})

export default UserIdPage;