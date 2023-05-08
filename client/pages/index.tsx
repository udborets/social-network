import { FC } from "react";

const HomePage: FC = () => {
  return (
    <main
      className={`grid place-items-center w-full h-full`}
    >
      <h1 className="text-[3rem] mb-[50px] text-blue font-bold">
        Welcome to MyFriends
      </h1>
    </main>
  )
}

export default HomePage;