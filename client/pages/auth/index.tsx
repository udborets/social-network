import Head from "next/head";

import AuthForm from "@/features/AuthForm/AuthForm";

const AuthPage = () => {
  return (
    <>
      <Head>
        <title>Friends | Auth</title>
      </Head>
      <main className="w-full h-full grid sm:p-[100px] place-items-center">
        <AuthForm />
      </main>
    </>
  )
}

export default AuthPage