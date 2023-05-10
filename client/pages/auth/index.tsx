import Head from "next/head";
import { FC } from "react";

import AuthForm from "@/features/AuthForm/AuthForm";

const AuthPage: FC = () => {
  return (
    <>
      <Head>
        <title>MyFriends | Auth</title>
      </Head>
      <main className="w-full h-[calc(100vh-100px)] grid sm:p-[100px] place-items-center">
        <AuthForm />
      </main>
    </>
  )
}

export default AuthPage