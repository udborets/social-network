import { observer } from 'mobx-react-lite';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { FC, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

import Header from '@/features/Header/Header';
import { HeaderProps } from '@/features/Header/models';
import { useUserState } from '@/hooks/useUserState';
import { routeState } from '@/store/Route';
import { userState } from '@/store/User';
import '@/styles/global.scss';

const client = new QueryClient();

const headerProps: HeaderProps = {
  navLinks: [
    {
      href: "/auth",
      text: "Auth",
    },
    {
      href: "/posts",
      text: "Posts",
    },
    {
      href: "/friends",
      text: "Friends",
    },
    {
      href: "/users",
      text: "Users",
    },
  ]
}

const App: FC<AppProps> = observer(({ Component, pageProps }) => {
  const { localStorageUser, setUser } = useUserState()
  const router = useRouter();

  useEffect(() => {
    routeState.setCurrent(router.asPath);
  }, [router.asPath])

  useEffect(() => {
    console.log(localStorageUser)
    if (localStorageUser.id !== '') {
      setUser(localStorageUser);
    }
    if (userState.info.id === '') {
      router.push('/auth');
    }
  }, [])
  return (
    <>
      <Head>
        <title>Friends</title>
      </Head>
      <QueryClientProvider client={client}>
        <Header {...headerProps} />
        <Component {...pageProps} />
      </QueryClientProvider>
    </>
  )
})

export default App;