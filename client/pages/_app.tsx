import { observer } from 'mobx-react-lite';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useLocalStorage } from 'usehooks-ts';

import { DBUser } from '@/db/models';
import { userState } from '@/store/User';
import '@/styles/global.scss';
import { useUserState } from '@/hooks/useUserState';
import Header from '@/features/Header/Header';
import { HeaderProps } from '@/features/Header/models';
import { useRouter } from 'next/router';

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
  ]
}

const App = observer(({ Component, pageProps }: AppProps) => {
  const { localStorageUser, setUser } = useUserState()
  const router = useRouter();
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
      <QueryClientProvider client={client}>
        <Header {...headerProps} />
        <Component {...pageProps} />
      </QueryClientProvider>
    </>
  )
})

export default App;