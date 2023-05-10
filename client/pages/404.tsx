import { FC } from "react";

import BackToButton from "@/features/BackToButton/BackToButton";

const NotFoundPage: FC = () => {
  return (
    <main className="grid place-items-center min-h-[calc(100vh-100px)]">
      <div className="flex flex-col justify-center items-center gap-8 font-bold text-[2rem]">
        <h1>
          Oops!
        </h1>
        <h2>
          Page not found!
        </h2>
        <BackToButton
          text="Back to the Home page!"
          className="text-[1rem] font-normal"
          href={`/`}
        />
      </div>
    </main>
  )
}

export default NotFoundPage;