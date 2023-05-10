import { observer } from "mobx-react-lite";
import Link from "next/link";
import { FC } from "react";

import { userState } from "@/store/User";

const HomePage: FC = observer(() => {
  const isAuthed = userState.info.id !== '';
  return (
    <main
      className={`grid place-items-center min-w-full w-full min-h-[calc(100vh-100px)]`}
    >
      <div className="flex flex-col gap-4 justify-center items-center">

        <h1 className="text-[2rem] md:text-[3rem] mb-[50px] text-blue font-bold text-center">
          Welcome to MyFriends
        </h1>
        <h2 className="font-bold text-[1.5rem]">
          {isAuthed ? 'Good to see you again!' : 'You are not logged in!'}
        </h2>
        <Link href={isAuthed
          ? `/users/${userState.info.id}`
          : '/auth'}
          className="p-2 outline-[var(--blue)] outline w-fit h-fit rounded-[10px] hover:bg-blue-hover hover:text-white transition-all duration-300"
        >
          {isAuthed
            ? 'Visit my page'
            : 'Go to auth page'}
        </Link>
      </div>

    </main>
  )
})

export default HomePage;