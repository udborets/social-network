import { observer } from 'mobx-react-lite';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useLocalStorage } from 'usehooks-ts';

import { DBUser } from '@/db/models';
import { userState } from '@/store/User';
import '@/styles/global.scss';
import { useUserState } from '@/hooks/useUserState';

const client = new QueryClient();

const App = observer(({ Component, pageProps }: AppProps) => {
  const { localStorageUser, setUser } = useUserState()
  useEffect(() => {
    console.log(localStorageUser)
    if (localStorageUser.id !== '') {
      setUser(localStorageUser);
    }
  }, [])
  return (
    <>
      <QueryClientProvider client={client}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </>
  )
})

export default App;