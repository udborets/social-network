import { observer } from 'mobx-react-lite';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useLocalStorage } from 'usehooks-ts';

import { DBUser } from '@/db/models';
import { userState } from '@/store/User';
import '@/styles/global.scss';

const client = new QueryClient();

const App = observer(({ Component, pageProps }: AppProps) => {
  const [localStorageUser, setLocalStorageUser] = useLocalStorage<DBUser>('user', {
    age: null, avatarUrl: null, city: null, email: '', id: '', name: '', posts: [], univ: null
  })
  useEffect(() => {
    if (localStorageUser.id !== '') {
      userState.setState(localStorageUser);
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